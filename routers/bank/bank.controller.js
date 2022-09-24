const { Bank, User } = require("../../models");
const moment = require("moment");

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

  updateBankInfoTeacher: async (req, res) => {
    const updateDataName = req.params.updateData;
    const bankId = req.body.bank_id;
    const data = req.body.data;
    const updateableDataNames = [
      "name",
      "money_name",
      "class_code",
      "eza",
      "eza_term",
    ];
    if (!updateableDataNames.includes(updateDataName)) {
      return res
        .status(400)
        .json({ status: 400, message: "변경 가능한 Bank 데이터가 아닙니다." });
    }

    try {
      await Bank.update({ [updateDataName]: data }, { where: { id: bankId } });

      //eza_term 을 변경하는 요청이면: next_eza_day를 변경해주는 로직
      if (updateDataName === "eza_term") {
        const next_eza_date = moment().add(data, "d");
        await Bank.update(
          { next_eza_date: next_eza_date },
          { where: { id: bankId } }
        );
      }

      res.json({ status: 200, message: "정상 처리되었습니다." });
    } catch (err) {
      res
        .status(404)
        .json({ status: 400, message: "Bank Info Update를 실패했습니다." });
    }
  },

  getBankInfoStudnet: async (req, res) => {
    const user_uuid = req.userUUID;
    const { bank_uuid } = await User.findOne({
      where: { user_uuid: user_uuid },
      attributes: ["bank_uuid"],
    });
    const bankData = await Bank.findOne({
      where: { id: bank_uuid },
      attributes: [
        "id",
        "name",
        "money_name",
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
