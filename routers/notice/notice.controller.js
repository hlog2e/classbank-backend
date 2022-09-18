const { Notice } = require("../../models");

module.exports = {
  getAllNotices: async (req, res) => {
    const notices = await Notice.findAll();
    res.json({ status: 200, message: "정상 처리되었습니다", notices: notices });
  },
};
