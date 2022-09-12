const express = require("express");
const { checkLogin } = require("../../middlewares/auth");
const router = express.Router();

const authController = require("./auth.controller");

router.post("/join", authController.join);
router.post("/login", authController.login);

module.exports = router;
