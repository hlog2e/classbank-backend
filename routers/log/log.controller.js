const { BalanceLog } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  getAllBalanceLog: async (req, res) => {
    const user_uuid = req.userUUID;
    const balanceLogs = await BalanceLog.findAll({
      where: {
        [Op.or]: [{ sender_id: user_uuid }, { receiver_id: user_uuid }],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      status: 200,
      message: "정상 처리되었습니다.",
      balanceLogs: balanceLogs,
    });
  },
};
