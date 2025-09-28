const Redis = require("ioredis");

// Cria uma única instância reutilizável
const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    maxRetriesPerRequest: 3,
    connectTimeout: 5000,
});

async function setCache(key, value, ttl = 86400 * 2) {
    if (!process.env.UPSTASH_REDIS_URL) {
        console.error("Variável UPSTASH_REDIS_URL não definida");
        return;
    }

    try {
        await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (err) {
        console.error("Erro ao definir cache:", err.message);
        throw err; // Opcional: rejeitar para o chamador tratar
    }
}

async function getCache(key) {
    if (!process.env.UPSTASH_REDIS_URL) {
        console.error("Variável UPSTASH_REDIS_URL não definida");
        return null;
    }

    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Erro ao buscar cache:", err.message);
        return null;
    }
}

// Opcional: fechar conexão quando o app terminar
process.on('exit', () => redis.quit());

module.exports = { setCache, getCache };