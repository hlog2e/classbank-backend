const { User, Bank } = require("../../models");
const { signAccess, signRefresh } = require("../../utils/jwt-util");
const { verifyPassword } = require("../../utils/password");
const uuid = require("uuid");
const moment = require("moment");

const password = require("../../utils/password");

module.exports = {
  join: async (req, res) => {
    const user_data = req.body;
    const user_uuid = uuid.v4();
    //DB에 들어갈 Password 암호화
    const hashedPassword = await password.createHashedPassword(
      user_data.password
    );

    const alreadyUserExist = await User.findOne({
      where: { user_id: user_data.user_id },
    });

    //User에 같은 user_id가 존재할 경우
    if (alreadyUserExist) {
      return res.status(409).json({
        status: 409,
        message: "아이디 " + user_data.user_id + "은(는) 이미 사용중 입니다!",
      });
    }

    //선생님인 경우 Bank 컬럼 생성
    if (user_data.type === "teacher") {
      const bank_id = uuid.v4();
      try {
        await Bank.create({
          id: bank_id,
          name: "클래스",
          money_name: "원",
          classCode: user_data.classCode,
          eza: "2",
          eza_term: "7",
          next_eza_date: moment().add(7, "d"),
        });
      } catch (err) {
        if (err.original.errno === 1062) {
          return res.status(409).json({
            status: 409,
            message:
              "클래스코드 " +
              user_data.classCode +
              "은(는) 이미 사용중 입니다!",
          });
        }
      }
      await User.create({
        user_uuid: user_uuid,
        user_id: user_data.user_id,
        password: hashedPassword.hashedPassword,
        password_salt: hashedPassword.salt,
        name: user_data.name,
        phone_number: user_data.phone_number,
        type: user_data.type,
        bank_uuid: bank_id,
      });
    } else {
      //학생인 경우 DB 생성 로직
      const bank_info = await Bank.findOne({
        where: { classCode: user_data.classCode },
      });
      if (!bank_info) {
        return res
          .status(404)
          .json({ status: 400, message: "클래스 코드가 잘못 되었습니다." });
      }
      await User.create({
        user_uuid: user_uuid,
        user_id: user_data.user_id,
        password: hashedPassword.hashedPassword,
        password_salt: hashedPassword.salt,
        name: user_data.name,
        phone_number: user_data.phone_number,
        type: user_data.type,
        bank_uuid: bank_info.id,
      });
    }

    const access_token = signAccess(user_uuid);
    res.cookie("access_token", access_token, {
      maxAge: 1000 * 60 * 60, //1시간
      httpOnly: true,
    });

    const refresh_token = signRefresh(user_uuid);
    res.cookie("refresh_token", refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 30 * 12, //360일
      httpOnly: true,
    });
    return res.json({
      status: 200,
      message: "회원가입 완료",
      user_data: {
        user_uuid: user_data.user_uuid,
        name: user_data.name,
        type: user_data.type,
      },
    });
  },

  login: async (req, res) => {
    const loginData = req.body;
    const user_data = await User.findOne({
      where: { user_id: loginData.user_id },
    });
    //ID가 존재하지 않는 경우
    if (!user_data) {
      return res
        .status(403)
        .json({ status: 403, message: "아이디 또는 비밀번호가 틀렸습니다!" });
    }

    const passwordValid = await verifyPassword(
      loginData.password,
      user_data.password_salt,
      user_data.password
    );

    if (passwordValid) {
      // 해시된 비밀번호가 일치하는 경우
      //TODO:여기에 로그인 로그 DB에 생성하는 로직 추가
      const access_token = signAccess(user_data.user_uuid);
      res.cookie("access_token", access_token, {
        maxAge: 1000 * 60 * 60, //1시간
        httpOnly: true,
      });

      const refresh_token = await signRefresh(user_data.user_uuid);
      res.cookie("refresh_token", refresh_token, {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 12, //360일
        httpOnly: true,
      });

      console.log(access_token);
      console.log(refresh_token);
      return res.json({
        status: 200,
        message: "로그인 성공",
        user_data: {
          user_uuid: user_data.user_uuid,
          name: user_data.name,
          type: user_data.type,
        },
      });
    } else {
      // 비밀번호가 일치 하지 않는경우
      return res
        .status(403)
        .json({ status: 403, message: "아이디 또는 비밀번호가 틀렸습니다!" });
    }
  },
};
