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

    const teacherData = await User.findOne({
      where: { user_uuid: teacher_uuid },
    });

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
        sender_id: student_uuid,
        sender_name: userData.name,
        receiver_id: teacher_uuid,
        receiver_name: teacherData.name,
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
        sender_name: teacherData.name,
        receiver_id: student_uuid,
        receiver_name: userData.name,
        amount: amount,
        reason: reason,
      });

      return res.json({
        status: 200,
        message: userData.name + " 학생에게 " + amount + "을 지급 했습니다.",
      });
    }
  },

  sendMoneyStudnet: async (req, res) => {
    const sender_id = req.userUUID;
    const receiver_id = req.body.receiver_id;
    const amount = req.body.amount;

    if (!receiver_id) {
      return res
        .status(400)
        .json({ status: 400, message: "받는 사람이 선택되지 않았습니다." });
    }
    if (!amount) {
      return res
        .status(400)
        .json({ status: 400, message: "금액이 입력되지 않았습니다." });
    }

    console.log(sender_id);
    console.log(receiver_id);
    console.log(amount);
    const userData = await User.findOne({
      where: { user_uuid: sender_id },
    });

    if (amount > userData.balance) {
      return res.status(400).json({
        status: 400,
        message: "송금할 금액이 출금 가능 금액보다 큽니다.",
      });
    }

    await userData.increment({ balance: -amount });

    const receiver = await User.findOne({
      where: { user_uuid: receiver_id },
    });
    console.log(receiver);
    await receiver.increment({ balance: amount });

    await BalanceLog.create({
      sender_id: sender_id,
      sender_name: userData.name,
      receiver_id: receiver_id,
      receiver_name: receiver.name,
      amount: amount,
      reason: "송금하기",
    });

    return res.json({
      status: 200,
      message:
        receiver.number +
        " " +
        receiver.name +
        "님 에게 송금을 성공하였습니다!",
    });
  },
};
