const { Item } = require("../../models");

module.exports = {
  getAllItems: async (req, res) => {
    const bank_id = req.query.bank_id;
    if (!bank_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bank 정보가 잘못 되었습니다." });
    }

    const items = await Item.findAll(
      { where: { bank_id: bank_id } },
      { attributes: ["id", "name", "desc", "price", "status"] }
    );

    res.json({ status: 200, message: "정상 처리되었습니다.", items: items });
  },
};
