const Redis = require("ioredis");

const redis = new Redis(process.env.UPSTASH_REDIS_URL); // ou direto na string, mas o ideal é usar variável

module.exports = redis;
