const { User } = require("../../models");

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
};
