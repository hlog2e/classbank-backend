const express = require("express");
const { checkToken, checkTeacher } = require("../../middlewares/auth");
const router = express.Router();

const userController = require("./user.controller");

router.get(
  "/teacher",
  checkToken,
  checkTeacher,
  userController.getAllUserTeacher
);
router.post(
  "/teacher/info",
  checkToken,
  checkTeacher,
  userController.postEditUserInfoTeacher
);

router.get("/student/info", checkToken, userController.getUserInfoStudnet);

module.exports = router;
