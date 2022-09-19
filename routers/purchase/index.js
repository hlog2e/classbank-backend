const express = require("express");
const { checkToken, checkTeacher } = require("../../middlewares/auth");
const router = express.Router();

const purchaseController = require("./purchase.controller");

router.get(
  "/teacher/pending",
  checkToken,
  checkTeacher,
  purchaseController.getAllPendingPurchaseTeacher
);
router.get(
  "/teacher/pending/count",
  checkToken,
  checkTeacher,
  purchaseController.getCountPurchasesTeacher
);

module.exports = router;
