const { Bank, User } = require("../../models");
module.exports = {
  getBankInfoTeacher: async (req, res) => {
    const { bank_uuid } = await User.findOne({
      where: { user_uuid: req.userUUID },
      attributes: ["bank_uuid"],
    });

    const bankData = await Bank.findOne({
      where: { id: bank_uuid },
      attributes: [
        "id",
        "name",
        "money_name",
        "class_code",
        "eza",
        "eza_term",
        "next_eza_date",
      ],
    });
    res.json({
      status: 200,
      message: "정상 처리되었습니다.",
      bankData: bankData,
    });
  },
};
