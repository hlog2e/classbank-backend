module.exports = {
  apps: [
    {
      name: "classbank-backend",
      script: "./app.js",
      instances: 0,
      exec_mode: "cluster",
      merge_logs: true, // 클러스터 모드 사용 시 각 클러스터에서 생성되는 로그를 한 파일로 합쳐준다.
      autorestart: true, // 프로세스 실패 시 자동으로 재시작할지 선택
      watch: false, // 파일이 변경되었을 때 재시작 할지 선택
      error_file: "./logs/error.log",
      out_file: "./logs/all.log",
    },
  ],
};
