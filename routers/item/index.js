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

module.exports = router;
