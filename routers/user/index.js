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
//여기서부터는 학생
router.get("/student/info", checkToken, userController.getUserInfoStudnet);

router.get(
  "/student/same-bank",
  checkToken,
  userController.getSameBankStudents
);

module.exports = router;
