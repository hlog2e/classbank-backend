const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY,
  process.env.SOLAPI_API_SECRET
);

module.exports = {
  sendOneSMS: (_phoneNumber, _msg) => {
    messageService
      .send([
        {
          to: _phoneNumber,
          from: process.env.SOLAPI_NUMBER,
          text: _msg,
        },
      ])
      .then((res) => console.log("SMS 단건 발송 : " + _msg));
  },
};
