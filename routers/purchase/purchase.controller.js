const { Purchase, User } = require("../../models");
const uuid = require("uuid");
module.exports = {
  getAllPendingPurchaseTeacher: async (req, res) => {
    const bank_id = req.query.bank_id;
    if (!bank_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bank 정보가 잘못 되었습니다." });
    }

    const purchases = await Purchase.findAll({
      where: { bank_id: bank_id, status: "pending" },
      attributes: [
        "id",
        "buyer_id",
        "buyer_number",
        "buyer_name",
        "item_id",
        "item_name",
        "price",
        "status",
        "createdAt",
      ],
    });

    res.json({
      status: 200,
      message: "정상 처리되었습니다.",
      purchases: purchases,
    });
  },
  getCountPurchasesTeacher: async (req, res) => {
    const bank_id = req.query.bank_id;
    if (!bank_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bank 정보가 잘못 되었습니다." });
    }

    const purchases = await Purchase.findAll({
      where: { bank_id: bank_id, status: "pending" },
      attributes: ["id"],
    });

    res.json({
      status: 200,
      message: "정상 처리되었습니다.",
      count: purchases.length,
    });
  },

  //여기서부터는 학생 컨트롤러

  getPendingPurchaseStudent: async (req, res) => {
    const user_uuid = req.userUUID;

    const purchases = await Purchase.findAll({
      where: { buyer_id: user_uuid, status: "pending" },
      attributes: ["id", "item_id", "item_name", "price", "createdAt"],
    });

    res.json({
      status: 200,
      message: "정상 처리되었습니다.",
      purchases: purchases,
    });
  },

  createNewPurchase: async (req, res) => {
    const user_uuid = req.userUUID;
    const item_data = req.body.item_data;

    const userData = await User.findOne({ where: { user_uuid: user_uuid } });

    await Purchase.create({
      id: uuid.v4(),
      buyer_id: user_uuid,
      buyer_number: userData.number,
      buyer_name: userData.name,
      item_id: item_data.id,
      item_name: item_data.name,
      price: item_data.price,
      status: "pending",
      bank_id: userData.bank_uuid,
    });

    res.json({
      status: 200,
      message: item_data.name + "을 구입 요청하였습니다.",
    });
  },

  cancelPurchase: async (req, res) => {
    const purchase_id = req.body.purchase_id;

    await Purchase.update({ status: "cancel" }, { where: { id: purchase_id } });

    res.json({
      status: 200,
      message: "구입을 취소하였습니다.",
    });
  },
};
