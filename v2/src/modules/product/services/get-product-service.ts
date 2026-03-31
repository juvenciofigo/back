import { ProductRepository, ProductNotFoundError } from "../index.js";
import { TrackProductView } from "./trackProductView.js";
import { IProduct } from "../index.js";
import { Request } from "express-jwt";

interface ServiceRequest {
    productId: string;
    userId: string | null;
    req: Request;
}

export class GetProductService {
    private productRepository: ProductRepository;
    private trackProductView: TrackProductView;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
        this.trackProductView = new TrackProductView(productRepository);
    }

    async execute({ productId, userId, req }: ServiceRequest): Promise<IProduct | null> {
        const product = await this.productRepository.findProductById(productId);

        if (!product) {
            throw new ProductNotFoundError();
        }

        // Tracking assíncrono — não bloqueia a resposta
        this.trackProductView.execute({ productId, userId, req }).catch((err) => {
            console.error("[TrackProductView] Erro:", err);
        });

        return product;
    }
}
