import { ProductRepository } from "../index.js";
import { Request as REQ } from "express-jwt";
import axios from "axios";
import { UAParser } from "ua-parser-js";


interface Request {
    userId: string | null;
    productId: string;
    req: REQ;
}
export class TrackProductView {
    private productRepository: ProductRepository;


    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async execute({ req, userId = null, productId }: Request) {
        // Admins não contam como visualização
        if (userId && req.auth?.role?.includes("admin")) return;

        const ip = (req.headers["x-forwarded-for"]
            ? String(req.headers["x-forwarded-for"]).split(",")[0]
            : req.connection?.remoteAddress) ?? "unknown";

        const userAgent = req.headers["user-agent"] || "unknown";
        const referrer = req.get("Referrer") || null;

        // Detalhes do dispositivo
        const deviceInfo = this.detectarDispositivo(userAgent);

        // Buscar localização pelo IP (silenciar erros para não bloquear)
        let locationInfo = null;
        try {
            locationInfo = await this.getLocationFromIP(ip);
        } catch {
            // não crítico, continua sem localização
        }

        // Dados do visitante para guardar em guests[]
        const guestData = {
            ip,
            userAgent: deviceInfo,
            referrer,
            ...(locationInfo && { location: locationInfo }),
            ...(userId && { user: userId }),
        };

        // Buscar o registo de views de hoje para este produto
        const viewOnDay = await this.productRepository.getViewOnDay(productId);

        if (viewOnDay) {
            // Já existe registo hoje → incrementar contador e adicionar visitante
            await this.productRepository.updateViewOnDay(viewOnDay._id as string, guestData);
        } else {
            // Não existe registo hoje → criar documento novo
            await this.productRepository.trackProductView(productId, guestData);
        }
    }

    detectarDispositivo(userAgentString: string) {
        const parser = new UAParser();
        const result = parser.setUA(userAgentString).getResult();

        return {
            navegador: result.browser.name,
            navegadorVersao: result.browser.version,
            sistemaOperacional: result.os.name,
            soVersao: result.os.version,
            tipoDispositivo: result.device.type || "desktop",
            fabricante: result.device.vendor || "Desconhecido",
            modelo: result.device.model || "Desconhecido",
        };
    }


    async getLocationFromIP(ip: string) {
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
}