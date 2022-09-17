const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const { RefreshToken, User } = require("../models");

// access_token 발급
module.exports = {
  signAccess: async (_userUuid) => {
    const { type } = await User.findOne({ where: { user_uuid: _userUuid } });

    const payload = {
      user_id: _userUuid,
      type: type,
    };

    return jwt.sign(payload, secret, {
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: "1h", // 유효기간
      subject: "access_token",
      issuer: "classbank.kr",
    });
  },

  // access token 검증
  verifyAccess: (_token) => {
    try {
      return jwt.verify(_token, secret);
    } catch (err) {
      return null;
    }
  },

  // refresh token 발급
  signRefresh: async (_userUuid) => {
    const payload = {
      user_id: _userUuid,
    };
    const refresh_token = jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "1y",
    });

    try {
      await RefreshToken.create({
        //DB에 유저의 리프레시 토큰이 없다면 CREATE
        token: refresh_token,
        issuer: _userUuid,
      });
    } catch (err) {
      if (err.original.errno === 1062) {
        await RefreshToken.update(
          //DB에 유저의 리프레시 토큰이 있다면 UPDATE
          {
            token: refresh_token,
          },
          { where: { issuer: _userUuid } }
        );
      }
    }
    return refresh_token;
  },

  // refresh token 검증
  verifyRefresh: async (_token) => {
    try {
      const decode = jwt.verify(_token, secret);
      //refresh_token 유효성 검사를 위해 DB쿼리
      const queryRefresh = await RefreshToken.findOne({
        where: { token: _token },
      });
      //만약 refresh_token이 DB에 없다면 null 리턴
      if (!queryRefresh) {
        return null;
      }
      return decode;
    } catch (err) {
      return null;
    }
  },
};
