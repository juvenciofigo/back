const redis = require("../controllers/integracoes/redisClient");
const axios = require("axios");

async function getLocationFromIP(ip) {
    console.log(false);
    const cached = await redis.get(`ip:${ip}`);

    if (cached) {
        return JSON.parse(cached);
    }

    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const { country, regionName, city } = response.data;

    const location = {
        country: country || "Moçambique",
        province: regionName || undefined,
        city: city,
    };

    // Cache por 24 horas (86400 segundos)
    await redis.set(`ip:${ip}`, JSON.stringify(location), "EX", 86400*2);

    console.log(location);
    
    return location;
}

module.exports = {
    getLocationFromIP,
};
