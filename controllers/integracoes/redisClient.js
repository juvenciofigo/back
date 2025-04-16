const Redis = require("ioredis");

async function setCache(key, value, ttl = 86400 * 2) {
    const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
        lazyConnect: true,
        enableOfflineQueue: false,
    });

    try {
        await redis.connect();
        await redis.set(key, JSON.stringify(value), "EX", ttl); /// Cache por 24*2 horas (86400*2 segundos)
    } catch (err) {
        console.error("Erro ao definir cache:", err.message);
    } finally {
        await redis.quit(); // desconecta após usar
    }
}

async function getCache(key) {
    const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
        lazyConnect: true,
        enableOfflineQueue: false,
    });

    try {
        await redis.connect();
        const data = await redis.get(key);
        console.log(JSON.parse(data))
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Erro ao buscar cache:", err.message);
        return null;
    } finally {
        await redis.quit();
    }
}

module.exports = { setCache, getCache };
