const redis = require("../controllers/integracoes/redisClient");
const axios = require("axios");

async function getLocationFromIP(ip) {
    if (ip === "::1") return null;
    const cached = await redis.get(`ip:${ip}`);

    if (cached) {
        return JSON.parse(cached);
    }

    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { country_name, region, city } = response.data;

    const location = {
        country: country_name || "Moçambique",
        province: region || undefined,
        city: city,
    };

    // Cache por 24*2 horas (86400*2 segundos)
    await redis.set(`ip:${ip}`, JSON.stringify(location), "EX", 86400 * 2);

    return location;
}

module.exports = {
    getLocationFromIP,
};
