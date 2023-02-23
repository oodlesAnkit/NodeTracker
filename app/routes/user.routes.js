const router = require("express").Router();

const User = require("../controller/user.controller");

const { verifyLogin } = require("../middlewares/auth.middleware");

const user = new User();

/**
 * @method GET
 */
router.get("/showAllUser", verifyLogin, user.listAllUser);
router.get("/loginHistory", verifyLogin, user.getLoginHistory);
router.get("/countLoginHistory", verifyLogin, user.getLoginHistoryIpBased);

/**
 * @method PUT
 */
router.put("/block-user-ip", verifyLogin, user.blockUserIP);

/**
 * @method POST
 */
router.post("/create", user.create);
router.post("/login", user.userLogin);
module.exports = router;
