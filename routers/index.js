const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const userRouter = require("./user");
const bankRouter = require("./bank");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/bank", bankRouter);

module.exports = router;
