const express = require("express");
const { checkToken, checkTeacher } = require("../../middlewares/auth");
const router = express.Router();

const purchaseController = require("./purchase.controller");

router.get(
  "/teacher/pending",
  checkToken,
  purchaseController.getAllPendingPurchaseTeacher
);

module.exports = router;
