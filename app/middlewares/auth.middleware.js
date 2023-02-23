const jwt = require("jsonwebtoken");
const user = require("../schema/user");
const { JWT_SECERT, JWT_EXPIRES_AT } = require("../../config/envs");

const verifyLogin = function (req, res, next) {
  // next();

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) return res.send("Invalid token");

      const decoded = jwt.verify(token, JWT_SECERT);
      // console.log(decoded);
      // user.findByPk(decoded.id);
      // console.log(decoded.id);
      next();
    } catch (error) {
      return res.send(error);
    }
  } else return res.send({ msg: "No token found" }, 409);
};

module.exports = { verifyLogin };
