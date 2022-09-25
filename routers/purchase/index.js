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
//밑에부터는 학생 라우터

router.get(
  "/student/pending",
  checkToken,
  purchaseController.getPendingPurchaseStudent
);

router.post("/student/new", checkToken, purchaseController.createNewPurchase);

router.post("/student/cancel", checkToken, purchaseController.cancelPurchase);

module.exports = router;
