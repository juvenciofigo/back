import { IProductRepository, ProductNotFoundError, IProduct } from "../index.js";
import { TrackProductView } from "./trackProductView.js";
import { Request } from "express-jwt";

interface ServiceRequest {
    productId: string;
    userId: string | null;
    req: Request;
}

export class GetProductService {

    constructor(
        private productRepository: IProductRepository,
        private trackProductView: TrackProductView
    ) { }

    async execute({ productId, userId, req }: ServiceRequest): Promise<IProduct | null> {
        const product = await this.productRepository.getProduct({ id: productId });

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
