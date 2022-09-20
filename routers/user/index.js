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

module.exports = router;
