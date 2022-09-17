const express = require("express");
const { checkToken, checkTeacher } = require("../../middlewares/auth");
const router = express.Router();

const userController = require("./user.controller");

router.get("/check", checkToken, checkTeacher, userController.helloWorld);

module.exports = router;
