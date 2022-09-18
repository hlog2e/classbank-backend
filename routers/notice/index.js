const express = require("express");
const { checkToken } = require("../../middlewares/auth");
const router = express.Router();

const noticeController = require("./notice.controller");

router.get("/", checkToken, noticeController.getAllNotices);

module.exports = router;
