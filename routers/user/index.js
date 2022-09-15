const express = require("express");
const { checkToken } = require("../../middlewares/auth");
const router = express.Router();

const userController = require("./user.controller");

router.get("/check", checkToken, userController.helloWorld);

module.exports = router;
