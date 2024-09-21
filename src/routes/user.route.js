const authMiddleware = require("../middleware/auth.middleware");
const userService = require("../service/user.service");

const router = require("express").Router();

router.route("/get").get(authMiddleware(), userService.getUser);
router.route("/refresh").get(authMiddleware(false), userService.newAccessToken);

router.route("/login").post(userService.login);
router.route("/register").post(userService.register);
module.exports = router;
