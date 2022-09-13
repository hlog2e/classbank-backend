const { verifyAccess } = require("../utils/jwt-util");

// 로그인을 체크하는 로직
module.exports = {
  checkLogin: (req, res, next) => {
    console.log(req.cookies);
    if (req.cookies.access_token && req.cookies.refresh_token) {
      const access_token = req.cookies.access_token;
      const accessValid = verifyAccess(access_token);
      console.log(accessValid);
    } else {
      req.isAuth = false;
      console.log("로그인안됨");
      next();
    }
  },
};

//
