const Redis = require("ioredis");

const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: false,
    enableOfflineQueue: false,
    tls: {}, // necessário para conexões TLS (Upstash usa TLS)
});

redis.on("error", (err) => {
    console.error("[Redis Error]:", err.message);
});

async function setCache(key, value, ttl = 86400 * 2) {
    try {
        await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (err) {
        console.error("Erro ao definir cache:", err.message);
    }
}

async function getCache(key) {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Erro ao buscar cache:", err.message);
        return null;
    }
}

module.exports = { setCache, getCache };
