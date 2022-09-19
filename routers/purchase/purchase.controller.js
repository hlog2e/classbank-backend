const { Purchase, User } = require("../../models");

module.exports = {
  getAllPendingPurchaseTeacher: async (req, res) => {
    const bank_id = req.query.bank_id;
    if (!bank_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bank 정보가 잘못 되었습니다." });
    }

    const purchases = await Purchase.findAll(
      {
        where: { bank_id: bank_id, status: "pending" },
      },
      {
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
      }
    );

    res.json({
      status: 200,
      message: "정상 처리되었습니다.",
      purchases: purchases,
    });
  },
};
