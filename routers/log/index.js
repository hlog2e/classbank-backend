const express = require("express");
const { checkToken } = require("../../middlewares/auth");
const router = express.Router();

const logController = require("./log.controller");

//아래부터는 학생

router.get("/student/balance", checkToken, logController.getAllBalanceLog);

module.exports = router;
