const { Op } = require("sequelize");
const { user, userLoginActivities, sequelize } = require("../schema");
const {
  validateCreateUser,
  valiateLoginDetails,
  validateBlockUserDetails,
  validateLoginHistoryIpBased,
} = require("../validators/user.validators");
const bcrypt = require("bcrypt");
const { JWT_SECERT, JWT_EXPRIES_IN } = require("../../config/envs");
const jwt = require("jsonwebtoken");
const requstIp = require("request-ip");
const { logger, errorLogger } = require("../utils/logger.util");
const { CustomValidationError } = require("../errors/custom_validation_error");

const clientIp = require("get-client-ip");
const { UnauthorizedUserError } = require("../errors/unautherized_user_error");

class User {
  async create(req, res) {
    logger.info("user create - started");
    const { error } = validateCreateUser(req.body);
    if (error) {
      throw new CustomValidationError(
        error,
        500,
        req.user?.id,
        req.params,
        req.body
      );
      // errorLogger.error("user create - " + error);
      // return res.send({ err: error.details[0].message }, 400);
    }

    const existingUser = await user.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    console.log(existingUser);
    if (existingUser) {
      if (existingUser.username === req.body.username) {
        throw new CustomValidationError(
          error,
          500,
          req.user?.id,
          req.params,
          req.body
        );
        // errorLogger.error("Create User - Username alreay exits");
        // return res.send({ err: "Username alreay exits" }, 409);
      } else if (existingUser.email === req.body.email) {
        throw new CustomValidationError(
          error,
          500,
          req.user?.id,
          req.params,
          req.body
        );
        // errorLogger.error("Create User - Username alreay exits");
        // return res.send({ err: "Email is already in use" }, 409);
      }
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // console.log(req.body);
    delete req.body.password;
    const createdUser = await user.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: createdUser.id }, JWT_SECERT, {
      expiresIn: JWT_EXPRIES_IN,
    });

    logger.info("user create - new user created");
    res.send({ createdUser, token }, 200);
  }

  async userLogin(req, res) {
    const { error: bodyError } = valiateLoginDetails(req.body);

    if (bodyError) {
      throw new CustomValidationError(
        bodyError,
        500,
        req.user?.id,
        req.params,
        req.body
      );      //   console.log(bodyError.details[0].message);
      //   return res.send({ err: bodyError.details[0].message }, 400);
    }
    const { username, password } = req.body;

    const userFound = await user.findOne({
      where: {
        [Op.and]: [{ username: username }],
      },
    });

    if (userFound) {
      const isCorrectPassword = bcrypt.compareSync(
        password,
        userFound.password
      );
      console.log(isCorrectPassword);
      if (isCorrectPassword) {
        const isIpBlocked = await userLoginActivities.findOne({
          where: {
            [Op.and]: [{ user_id: userFound.id }, { ip: req.body.ip }],
          },
          order: [["createdAt", "desc"]],
        });

        if (
          isIpBlocked &&
          isIpBlocked.isIpBlocked &&
          isIpBlocked.isIpBlocked == "true"
        ) {


          logger.info(req.body.ip + " is blocked for " + userFound.email);
          throw new UnauthorizedUserError('User is blocked');
          // return res.status(522).send({
          //   messaage: req.body.ip + " is blocked for " + userFound.email,
          // });
        }

        const token = jwt.sign({ id: userFound.id }, JWT_SECERT, {
          expiresIn: JWT_EXPRIES_IN,
        });

        delete userFound.password;

        const tracking = await userLoginActivities.create({
          user_id: userFound.id,
          //   ip: req.socket.remoteAddress,
          ip: req.body.ip,
          userId: userFound.id,
        });

        return res.send({ userFound, token, messaage: "success " }, 200);
      }
    }
    return res.send({ err: "Invalid login details" }, 400);
  }

  async listAllUser(req, res) {
    user
      .findAll({
        attributes: [
          "id",
          "username",
          "email",
          "role",
          "isBlocked",
          "createdAt",
          "updatedAt",
          "isBlocked",
        ],
      })
      .then((users) => {
        return res.send({ users });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getLoginHistory(req, res) {
    console.log(req.headers.authorization.split(" "));

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECERT);
    const userTracking = await userLoginActivities.findAll({
      attributes: ["user_id", "ip", "createdAt", "isIpBlocked"],

      where: {
        [Op.and]: [{ user_id: decoded.id }],
      },
      include: {
        model: user,
        attributes: ["username", "role", "isBlocked", "createdAt"],
      },
      order: [["createdAt", "desc"]],
    });

    if (userTracking) {
      return res.send({ userTracking });
    }
  }

  async blockUserIP(req, res) {
    const { error } = validateBlockUserDetails(req.body);

    if (error) {
      return res.status(522).send({ error: error.details[0].message });
    }

    const lastUserLogin = await userLoginActivities.findOne({
      attributes: ["id", "isIpBlocked"],
      where: {
        [Op.and]: [{ user_id: req.body.user_id }, { ip: req.body.ip }],
      },
      order: [["createdAt", "desc"]],
    });

    if (!lastUserLogin) {
      return res
        .status(404)
        .send({ err: "User not login yet with this IP address" });
    } else if (lastUserLogin.isIpBlocked == "true") {
      return res.status(409).send({ err: "User IP is already blocked" });
    }

    const blockedUser = await userLoginActivities.update(
      { isIpBlocked: "true" },
      {
        where: {
          id: lastUserLogin.id,
        },
      }
    );

    if (blockedUser) {
      return res.status(200).send({ blockedUser, message: "success" });
    }
    return res.status(500).send({ err: "Something gone wrong" });
  }

  async getLoginHistoryIpBased(req, res) {
    const { err } = validateLoginHistoryIpBased(req.body);

    if (err) {
      return res.status(400).send({ err: err.details[0].message });
    }

    // const groupLoginHistory = await user.findAll({
    //   attributes: ["username"],
    //   distinct: 'username',
    //   where: {
    //     [Op.and]: [{ id: req.body.user_id }],
    //   },

    //   include: {
    //     model: userLoginActivities,
    //     attributes: [
    //       "ip",
    //       [sequelize.fn("count", sequelize.col("ip")), "ip_count"],
    //     ],
    //     group: "ip",
    //   },
    //   group: "username",
    // });

    const groupLoginHistory = await userLoginActivities.findAll({
      attributes: [
        "ip",
        [sequelize.fn("COUNT", sequelize.col("ip")), "ip_count"],
      ],
      group: "ip",
      //   include: {
      //     model: user,
      //     where: {
      //       [Op.and]: [{ email: req.body.email }],
      //     },
      //     // attributes: ["username"],
      //   },
    });

    if (groupLoginHistory) {
      return res.status(200).send(groupLoginHistory);
    }
    return res.status(400).send({ err: "Something gone wrong" });
  }
}

module.exports = User;
