const express = require("express");
const { checkToken, checkTeacher } = require("../../middlewares/auth");
const router = express.Router();

const itemController = require("./item.controller");

router.get("/teacher", checkToken, checkTeacher, itemController.getAllItems);
router.post(
  "/teacher/status",
  checkToken,
  checkTeacher,
  itemController.postEditItemStatus
);
router.post(
  "/teacher/delete",
  checkToken,
  checkTeacher,
  itemController.postItemDelete
);

router.post(
  "/teacher/add",
  checkToken,
  checkTeacher,
  itemController.postItemAdd
);

router.post(
  "/teacher/allow",
  checkToken,
  checkTeacher,
  itemController.postItemAllow
);

router.post(
  "/teacher/deny",
  checkToken,
  checkTeacher,
  itemController.postItemDeny
);

// 여기부터 밑에는 학생

router.get("/student", checkToken, itemController.getSaleItemsStudent);

module.exports = router;
