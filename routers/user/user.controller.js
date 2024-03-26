const { User, Bank } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  getAllUserTeacher: async (req, res) => {
    const bank_id = req.query.bank_id;
    if (!bank_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bank 정보가 잘못 되었습니다." });
    }

    const userData = await User.findAll({
      attributes: [
        "user_uuid",
        "user_id",
        "number",
        "name",
        "phone_number",
        "balance",
        "createdAt",
      ],
      order: [["number", "ASC"]],
      where: { bank_uuid: bank_id, type: "student" },
    });

    res.json({ status: 200, message: "정상 처리되었습니다.", users: userData });
  },
  postEditUserInfoTeacher: async (req, res) => {
    const user_uuid = req.body.user_uuid;

    const changeDataObj = req.body.changeDataObj;
    await User.update(
      {
        user_id: changeDataObj.user_id,
        number: changeDataObj.number,
        name: changeDataObj.name,
        phone_number: changeDataObj.phone_number,
      },
      { where: { user_uuid: user_uuid } }
    ).then(() => {
      res.json({ status: 200, message: "정상 처리되었습니다." });
    });
  },

  getUserInfoStudnet: async (req, res) => {
    const user_uuid = req.userUUID;

    const userData = await User.findOne({
      attributes: [
        "user_uuid",
        "user_id",
        "number",
        "name",
        "phone_number",
        "balance",
      ],
      where: { user_uuid: user_uuid },
    });
    res.json({ status: 200, message: "정상 처리되었습니다.", user: userData });
  },

  getSameBankStudents: async (req, res) => {
    const user_uuid = req.userUUID;

    const { bank_uuid } = await User.findOne({
      where: { user_uuid: user_uuid },
    });

    const students = await User.findAll({
      where: {
        user_uuid: { [Op.ne]: user_uuid }, // 자기 자신을 제외한 학급 학생들 쿼리
        bank_uuid: bank_uuid,
        type: "student",
      },
      attributes: ["user_uuid", "number", "name"],
    });

    res.json({
      status: 200,
      message: "정상 처리되었습니다.",
      students: students,
    });
  },

  passwordResetByTeacher: async (req, res) => {
    const teacherId = req.userUUID;
    const { studentId } = req.body;

    const { bank_uuid } = await User.findOne({
      where: {
        user_uuid: teacherId,
      },
    });

    const { class_code } = await Bank.findOne({ where: { id: bank_uuid } });

    await User.update(
      {
        password: class_code,
        password_salt: "",
        password_change_required: true,
      },
      { where: { user_uuid: studentId } }
    );

    res.json({
      status: 200,
      message: `비밀번호가 "${class_code}"로 초기화 되었습니다!"`,
    });
  },

  deleteUserByTeahcer: async (req, res) => {
    const { studentId } = req.body;

    await User.destroy({ where: { user_uuid: studentId } });

    res.json({
      status: 200,
      message: "정상적으로 탈퇴 처리되었습니다.",
    });
  },
};
