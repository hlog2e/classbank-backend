const express = require("express");
const { checkToken, checkTeacher } = require("../../middlewares/auth");
const router = express.Router();

const moneyController = require("./money.controller");

router.post(
  "/teacher/balance",
  checkToken,
  checkTeacher,
  moneyController.changeBalanceTeacher
);

//아래부터는 학생

router.post(
  "/student/send-money",
  checkToken,
  moneyController.sendMoneyStudnet
);

module.exports = router;
