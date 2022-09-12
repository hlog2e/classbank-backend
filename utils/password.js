const util = require("util");
const crypto = require("crypto");

const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const createSalt = async () => {
  const buf = await randomBytesPromise(64);

  return buf.toString("base64");
};

module.exports = {
  createHashedPassword: async (_password) => {
    const salt = await createSalt();
    const key = await pbkdf2Promise(_password, salt, 107237, 64, "sha512");
    const hashedPassword = key.toString("base64");

    return { hashedPassword, salt };
  },

  // _password:로그인 인증할 때의 사용자가 입력한 비밀번호, _userSalt:DB에 저장되어있는 사용자의 salt, _userPassword:DB에 저장되어있는 사용자의 암호화된 비밀번호(해시 값)
  verifyPassword: async (_password, _userSalt, _userPassword) => {
    const key = await pbkdf2Promise(_password, _userSalt, 107237, 64, "sha512");
    const hashedPassword = key.toString("base64");

    if (hashedPassword === _userPassword) return true;

    return false;
  },
};
