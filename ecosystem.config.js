module.exports = {
  apps: [
    {
      name: "app",
      script: "./app.js",
      instances: 1,  
      autorestart: true,
      watch: false,
    },
    {
      name: "bot-service",
      script: "./bot-service/bot-service.js",
      instances: 1,
      autorestart: true,
      watch: false,
    }
  ]
};
