const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const userRouter = require("./user");
const bankRouter = require("./bank");
const noticeRouter = require("./notice");
const itemRouter = require("./item");
const purchaseRouter = require("./purchase");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/bank", bankRouter);
router.use("/notice", noticeRouter);
router.use("/item", itemRouter);
router.use("/purchase", purchaseRouter);

module.exports = router;
