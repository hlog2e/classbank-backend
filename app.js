const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const moment = require("moment");

const mainRouter = require("./routers");

//express init
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

morgan.token("auth-token", (req, res) => {
  return JSON.stringify(req.headers.authorization);
});
morgan.token("ko-datetime", (req, res) => {
  return moment().format("YYYY-MM-DD hh:mm:ss.SSS A Z");
});
morgan.token("req-body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    '[IP : :remote-addr] [:ko-datetime] [:method|HTTP/:http-version|":url"|:status] [Agent:":user-agent"] [Authorization: :auth-token] [Body: :req-body] [res-length::res[content-length] referrer:":referrer"]'
  )
);
//CORS
const whitelist = ["http://localhost:3000", "https://classbank.kr"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // origin: "*", //For Postman
  credentials: true,
};

//For Uptime Checker
app.get("/", (req, res) => {
  res.json({ status: 200, message: "Welcome to CLASSBANK Backend" });
});

// CORS 이슈로 Uptime Checker 전에 / 라우트 전달
app.use(cors(corsOptions));

//DB Connect
const { sequelize } = require("./models");
sequelize
  .sync()
  .then(() => {
    console.log("DB연결 성공");
  })
  .catch((err) => {
    console.error("DB 연결 오류", err);
  });

app.use(mainRouter);

//에러 핸들링
app.use((req, res, next) => {
  res.status(404).send({ status: 404, message: "올바르지 않은 접근입니다." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ status: 500, message: "internal error" });
});

app.listen("3001", "0.0.0.0", () => {
  console.log("on 3001");
});
