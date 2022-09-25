const { Item, User, BalanceLog, Purchase } = require("../../models");
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

  postItemAllow: async (req, res) => {
    const teacher_uuid = req.userUUID;
    const item_data = req.body.item_data;

    const userData = await User.findOne({
      where: { user_uuid: item_data.buyer_id },
    });

    if (userData.balance < item_data.price) {
      return res.status(400).json({
        status: 400,
        message:
          userData.number +
          " " +
          userData.name +
          " 학생의 잔고가 부족하여 " +
          '"' +
          item_data.item_name +
          '"' +
          " 구매를 진행할 수 없습니다.",
      });
    } else {
      await userData.increment({ balance: -item_data.price });
      await BalanceLog.create({
        sender_id: teacher_uuid,
        receiver_id: item_data.buyer_id,
        type: "minus",
        amount: item_data.price,
        reason: item_data.item_name + " 구입",
      });
      await Purchase.update(
        { status: "allow" },
        { where: { id: item_data.id } }
      );
      return res.json({
        status: 200,
        message:
          userData.number +
          " " +
          userData.name +
          " 학생의 " +
          '"' +
          item_data.item_name +
          '"' +
          " 구입이 승인되었습니다.",
      });
    }
  },

  postItemDeny: async (req, res) => {
    const item_data = req.body.item_data;
    await Purchase.update({ status: "deny" }, { where: { id: item_data.id } });
    res.json({
      status: 200,
      message: item_data.item_name + " 구입을 거절하였습니다.",
    });
  },
};
