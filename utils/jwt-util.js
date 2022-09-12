const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const { RefreshToken } = require("../models");

// access_token 발급
module.exports = {
  signAccess: (_userUuid) => {
    const payload = {
      user_id: _userUuid,
    };

    return jwt.sign(payload, secret, {
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: "10s", // 유효기간
      subject: "access_token",
      issuer: "classbank.kr",
    });
  },

  // access token 검증
  verifyAccess: (_token) => {
    try {
      const decoded = jwt.verify(_token, secret);
    } catch (err) {
      return {
        isValid: false,
        user_id: decoded.user_id,
      };
    }

    return {
      isValid: true,
      user_id: decoded.user_id,
    };
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
  verifyRefresh: async (token, userId) => {
    try {
      const decode = jwt.verify(_token, secret);
    } catch (err) {
      return {
        isValid: false,
      };
    }
    return {
      isValid: true,
    };
  },
};
