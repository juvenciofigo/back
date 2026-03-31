import { describe, it, expect, vi } from "vitest";

// Interceptar o firebase antes de importar qualquer outra coisa
vi.mock('@/shared/utils/firebase', () => ({
    getBucket: () => ({
        file: () => ({
            createWriteStream: () => ({
                on: vi.fn(),
                end: vi.fn(),
            }),
            delete: vi.fn(),
        }),
        name: 'mock-bucket',
    }),
}));

import { GetCartTotalService } from "../get-cart-total-service.js";
import { CartRepository } from "../../repositories/cart-interface-repository.js";

// Mock do CartNotFoundError (uma classe de erro básica)
class MockCartNotFoundError extends Error {
    constructor() {
        super("Cart not found");
        this.name = "CartNotFoundError";
    }
}

describe("GetCartTotalService", () => {
    // 1. Criar um Mock (uma cópia falsa) do repositório
    // Não vamos conectar ao banco de dados, apenas fingir que o banco respondeu algo.
    const makeFakeCartRepository = (): CartRepository => {
        return {
            createCart: vi.fn(),
            fetchCartByUser: vi.fn(),
            removeProductToCart: vi.fn(),
            updateProductQuantity: vi.fn(),
            updateCartPayment: vi.fn(),
            clearCart: vi.fn(),
            addProductToCart: vi.fn(),
            fetchCartsPaginate: vi.fn(),
        } as unknown as CartRepository;
    };

    it("deve retornar total 0 se o utilizador não estiver logado e enviar um body vazio", async () => {
        // Preparação (Arrange)
        const fakeRepository = makeFakeCartRepository();
        const sut = new GetCartTotalService(fakeRepository);

        // Ação (Act)
        const result = await sut.execute({ userId: null, body: [] });

        // Afirmação (Assert)
        expect(result).toEqual({ total: 0 });
    });

    it("deve calcular o preço corretamente a partir do body (utilizador não logado)", async () => {
        const fakeRepository = makeFakeCartRepository();
        const sut = new GetCartTotalService(fakeRepository);

        // Simulamos o payload que o frontend enviaria no carrinho
        const fakeBody: any = [
            {
                productId: { productPrice: 100 }, // Produto custa 100
                quantity: 2, // Comprou 2 (100 * 2 = 200)
            },
            {
                productId: { productPrice: 50 }, // Produto custa 50
                quantity: 1, // Comprou 1 (50)
                variation: {
                    color: { variationPrice: 10 }, // Capa vermelha +10 (50 + 10 = 60)
                },
            },
        ];

        const result = await sut.execute({ userId: null, body: fakeBody });

        // Total esperado: 200 + 60 = 260
        expect(result).toEqual({ total: 260 });
    });

    it("deve buscar o carrinho na base de dados se o userId for providenciado", async () => {
        const fakeRepository = makeFakeCartRepository();

        // Configuramos o mock para retornar um carrinho quando fetchCartByUser for chamado
        vi.mocked(fakeRepository.fetchCartByUser).mockResolvedValue({
            cartItens: [
                {
                    productId: { productPrice: 500 },
                    quantity: 1,
                }
            ]
        } as any);

        const sut = new GetCartTotalService(fakeRepository);

        const result = await sut.execute({ userId: "user-id-valido", body: [] });

        // Total esperado: 500 * 1 = 500
        expect(result).toEqual({ total: 500 });

        // Verificamos se o repositório foi realmente chamado
        expect(fakeRepository.fetchCartByUser).toHaveBeenCalledWith("user-id-valido");
    });
});
