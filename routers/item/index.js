const express = require("express");
const { checkToken, checkTeacher } = require("../../middlewares/auth");
const router = express.Router();

const itemController = require("./item.controller");

router.get("/teacher", checkToken, checkTeacher, itemController.getAllItems);

module.exports = router;
