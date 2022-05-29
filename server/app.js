const express = require("express");
const cors = require("cors");

const infiniteScroll = require('./infinitescroll')

const app = express();
const port = 4000;

//cors 옵션 설정
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: false })); // uri 파싱
app.use(cors(corsOptions));


//배포 환경에서 정상 응답 받는지 테스트하는 코드
app.get("/", infiniteScroll);

//일부러 에러 발생시키기 테스트
app.use((req, res, next) => {
  res.status(404).send("ok");
});

//서버에러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: "Internal Server Error",
    stacktrace: err.toString(),
  });
});

//서버 포트 설정
app.listen(port, () => {
  console.log(`${port}번 포트에서 대기중`);
});