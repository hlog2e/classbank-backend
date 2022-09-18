const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const userRouter = require("./user");
const bankRouter = require("./bank");
const noticeRouter = require("./notice");
const itemRouter = require("./item");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/bank", bankRouter);
router.use("/notice", noticeRouter);
router.use("/item", itemRouter);

module.exports = router;
