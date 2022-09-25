const { User, BalanceLog } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  changeBalanceTeacher: async (req, res) => {
    const teacher_uuid = req.userUUID;

    const student_uuid = req.body.uuid;
    const type = req.body.type;
    const amount = req.body.amount;
    const reason = req.body.reason;

    if (!student_uuid || !type || !amount || !reason) {
      return res
        .status(400)
        .json({ status: 400, message: "필수 입력 정보가 누락되었습니다." });
    }
    //회수하기
    if (type === "minus") {
      const userData = await User.findOne({
        where: { user_uuid: student_uuid },
      });

      if (amount > userData.balance) {
        return res.status(400).json({
          status: 400,
          message: userData.name + "학생의 출금가능 금액이 부족합니다.",
        });
      }

      await userData.increment({ balance: -amount });

      await BalanceLog.create({
        sender_id: teacher_uuid,
        receiver_id: student_uuid,
        type: type,
        amount: amount,
        reason: reason,
      });

      return res.json({
        status: 200,
        message: userData.name + " 학생에게 " + amount + "을 회수 했습니다.",
      });
    }
    //지급하기
    if (type === "plus") {
      const userData = await User.findOne({
        where: { user_uuid: student_uuid },
      });
      await userData.increment({ balance: amount });
      await BalanceLog.create({
        sender_id: teacher_uuid,
        receiver_id: student_uuid,
        type: type,
        amount: amount,
        reason: reason,
      });

      return res.json({
        status: 200,
        message: userData.name + " 학생에게 " + amount + "을 지급 했습니다.",
      });
    }
  },
};
