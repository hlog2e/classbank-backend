module.exports = {
  apps: [
    {
      name: "classbank-backend",
      script: "./app.js",
      instances: 0,
      exec_mode: "cluster",
    },
  ],
};
