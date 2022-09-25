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

module.exports = router;
