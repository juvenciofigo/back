// const { setCache, getCache } = require("../controllers/integracoes/redisClient");
import axios from "axios";

export async function getLocationFromIP(ip: string) {
    if (ip === "::1") return null;

    // const cached = await getCache(`ip:${ip}`);

    // if (cached) {
    // return cached;
    // }

    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { country_name, region, city } = response.data;

    const location = {
        country: country_name || "Moçambique",
        province: region || undefined,
        city: city,
    };

    // await setCache(`ip:${ip}`, location );

    return location;
}
