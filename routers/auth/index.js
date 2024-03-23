const express = require("express");
const router = express.Router();
const { checkToken } = require("../../middlewares/auth");

const authController = require("./auth.controller");

router.post("/join", authController.join);
router.post("/login", authController.login);
router.post("/logout", checkToken, authController.logout);
router.post(
  "/password-change/student",
  checkToken,
  authController.changeStudentPassword
);

module.exports = router;
