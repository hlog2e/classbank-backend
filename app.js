const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const mainRouter = require("./routers");

//express init
app.use(express.json());
app.use(morgan());
app.use(helmet());
app.use(cookieParser());
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
