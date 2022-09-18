const express = require("express");
const { checkToken, checkTeacher } = require("../../middlewares/auth");
const router = express.Router();

const bankController = require("./bank.controller");

router.get(
  "/teacher/info",
  checkToken,
  checkTeacher,
  bankController.getBankInfoTeacher
);
router.post(
  "/teacher/info/:updateData",
  checkToken,
  checkTeacher,
  bankController.updateBankInfoTeacher
);

module.exports = router;
