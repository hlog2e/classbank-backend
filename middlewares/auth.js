const {
  verifyAccess,
  verifyRefresh,
  signAccess,
  signRefresh,
} = require("../utils/jwt-util");

// 로그인을 체크하는 로직
module.exports = {
  checkToken: async (req, res, next) => {
    const access_token = verifyAccess(req.cookies.access_token);
    const refresh_token = await verifyRefresh(req.cookies.refresh_token); //refresh는 DB연결 로직때문에 await

    // access_token, refresh_token 모두 존재
    if (access_token && refresh_token) {
      req.isAuth = true;
      req.userUUID = access_token.user_uuid;
      next();
    }
    if (!access_token && !refresh_token) {
      // access_token, refresh_token 모두 만료
      req.isAuth = false;
      return res
        .status(401)
        .json({ status: 401, message: "인증정보가 유효하지 않습니다." });
    }
    //CASE 1: access_token 만료, refresh_token 존재
    if (!access_token) {
      const new_access_token = await signAccess(refresh_token.user_uuid); //refresh_token payload에 있는 user_uuid로 access_token 발급
      res.cookie("access_token", new_access_token, {
        maxAge: 1000 * 60 * 60, //1시간
        httpOnly: true,
      });
      req.cookies.access_token = new_access_token;
      req.isAuth = true;
      req.userUUID = refresh_token.user_uuid;
      next();
    }
    //CASE 2: refresh_token 만료, access_token 존재
    if (!refresh_token) {
      const new_refresh_token = await signRefresh(access_token.user_uuid);
      res.cookie("refresh_token", new_refresh_token, {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 12, //360일
        httpOnly: true,
      });
      req.cookies.refresh_token = new_refresh_token;
      req.isAuth = true;
      req.userUUID = access_token.user_uuid;
      next();
    }
  },
  checkTeacher: async (req, res, next) => {
    const { type } = verifyAccess(req.cookies.access_token);
    if (type === "teacher") {
      next();
    } else {
      return res.status(403).json({
        status: 403,
        message: "선생님 회원만 요청할 수 있는 API 입니다.",
      });
    }
  },
};
