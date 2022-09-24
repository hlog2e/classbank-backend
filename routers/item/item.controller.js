const { Item } = require("../../models");
const uuid = require("uuid");

module.exports = {
  getAllItems: async (req, res) => {
    const bank_id = req.query.bank_id;
    if (!bank_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bank 정보가 잘못 되었습니다." });
    }

    const items = await Item.findAll({
      where: { bank_id: bank_id },
      attributes: ["id", "name", "desc", "price", "status"],
    });

    res.json({ status: 200, message: "정상 처리되었습니다.", items: items });
  },
  postEditItemStatus: async (req, res) => {
    const item_id = req.body.item_id;
    const willChangeStatus = req.body.status;

    if (!item_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Item 정보가 잘못 되었습니다." });
    }

    const allowStatusArray = ["pending", "onsale"];
    if (!allowStatusArray.includes(willChangeStatus)) {
      return res
        .status(400)
        .json({ status: 400, message: "변경할 status 값이 잘못 되었습니다." });
    }

    await Item.update({ status: willChangeStatus }, { where: { id: item_id } });
    res.json({ status: 200, message: "아이템 상태 변경이 완료되었습니다." });
  },
  postItemDelete: async (req, res) => {
    const item_id = req.body.item_id;

    if (!item_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Item 정보가 없습니다." });
    }

    try {
      await Item.destroy({ where: { id: item_id } });
      res.json({ status: 200, message: "정상 처리되었습니다." });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 500,
        message: "Item 삭제 도중 오류가 발생하였습니다.",
      });
    }
  },
  postItemAdd: async (req, res) => {
    const bank_id = req.body.bank_id;
    const item_data = req.body.item_data;

    if (!bank_id || !item_data) {
      return res
        .status(400)
        .json({ status: 400, message: "필수 정보가 누락되었습니다." });
    }

    const newItem = await Item.create({
      id: uuid.v4(),
      name: item_data.name,
      desc: item_data.desc,
      price: item_data.price,
      status: "pending",
      bank_id: bank_id,
    });

    res.json({
      status: 200,
      message: "정상적으로 아이템이 생성되었습니다.",
      item: {
        id: newItem.id,
        name: newItem.name,
        desc: newItem.desc,
        price: newItem.price,
        status: newItem.status,
      },
    });
  },
};
