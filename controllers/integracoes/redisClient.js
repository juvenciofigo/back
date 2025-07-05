const Redis = require("ioredis");

async function setCache(key, value, ttl = 86400 * 2) {
    const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
        maxRetriesPerRequest: 1,
        lazyConnect: false,
        enableOfflineQueue: false,
        tls: {}, // necessário para Upstash
    });

    try {
        await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (err) {
        console.error("Erro ao definir cache:", err.message);
    } finally {
        await redis.quit(); // encerra corretamente a conexão
    }
}

async function getCache(key) {
    const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
        maxRetriesPerRequest: 1,
        lazyConnect: false,
        enableOfflineQueue: false,
        tls: {}, // necessário para Upstash
    });

    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Erro ao buscar cache:", err.message);
        return null;
    } finally {
        await redis.quit(); // encerra corretamente a conexão
    }
}

module.exports = { setCache, getCache };
