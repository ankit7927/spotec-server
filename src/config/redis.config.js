const { createClient } = require("redis");
const { appConfig } = require("./app.config");

const redisClient = createClient({
    url: appConfig.database.redis
})

module.exports = redisClient;