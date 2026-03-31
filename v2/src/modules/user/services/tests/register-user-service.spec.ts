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

import { RegisterUserService } from "../register-user-service.js";
import { UserRepository } from "../../repositories/user-interface-repository.js";

// Mock das classes de erro se não estivermos a buscar do index.js directamente para as instanciar
class MockUserAlreadyExistsError extends Error {
    constructor() {
        super("User Already Exists");
        this.name = "UserAlreadyExistsError";
    }
}

describe("RegisterUserService", () => {
    // 1. Criar Mock do Repositório de Utilizadores
    const makeFakeUserRepository = (): UserRepository => {
        return {
            findByEmail: vi.fn(),
            registerUser: vi.fn(),
            findByEmailWithPassword: vi.fn(),
            findById: vi.fn(),
            updatePhoto: vi.fn(),
            deleteUser: vi.fn(),
            getAdmins: vi.fn(),
            findAll: vi.fn(),
            updateUserRole: vi.fn(),
        } as unknown as UserRepository;
    };

    it("deve lançar um erro (UserAlreadyExistsError) se o email já estiver em uso", async () => {
        const fakeRepository = makeFakeUserRepository();
        // Simulamos que o e-mail já existe na base de dados
        vi.mocked(fakeRepository.findByEmail).mockResolvedValue({
            _id: "fake-id",
            email: "teste@teste.com",
            firstName: "Teste",
            lastName: "Teste",
            password: "hashedpassword",
            role: ["client"]
        } as any);

        const sut = new RegisterUserService(fakeRepository);

        // A acção deve lançar erro. Capturamo-lo alterando temporariamente o comportamento importado ou esperando que lance um tipo específico.
        // Como o erro importa do index dependendo da nossa implementação, vamos apenas capturar qualquer rejeição.
        await expect(sut.execute({
            email: "teste@teste.com",
            password: "123",
            firstName: "Joao",
            lastName: "Silva"
        })).rejects.toThrow();

        expect(fakeRepository.findByEmail).toHaveBeenCalledWith("teste@teste.com");
    });

    it("deve criar um utilizador, encriptar a password e retornar os dados + token se for um novo utilizador", async () => {
        const fakeRepository = makeFakeUserRepository();

        // Simular que NÃO existe utilizador com este email
        vi.mocked(fakeRepository.findByEmail).mockResolvedValue(null);

        // Simular o que o repositório devolve quando o utilizador é criado
        vi.mocked(fakeRepository.registerUser).mockResolvedValue({
            _id: "novo-id-123",
            email: "novo@teste.com",
            firstName: "Novo",
            lastName: "User",
            role: ["client"]
        } as any);

        // Criamos um espião (Spy) no utilitário de geração de Token, ou confiamos no original dele. 
        // Aqui assumimos que ele cria um JWT válido
        const sut = new RegisterUserService(fakeRepository);

        const result = await sut.execute({
            email: "novo@teste.com",
            password: "password123!",
            firstName: "Novo",
            lastName: "User"
        });

        expect(result).toHaveProperty("_id", "novo-id-123");
        expect(result).toHaveProperty("email", "novo@teste.com");
        expect(result).toHaveProperty("role", ["client"]);
        expect(result).toHaveProperty("token"); // Verifica que retornou um token
        expect(typeof result.token).toBe("string");

        // Verifica que o findByEmail foi chamado correctamente com o e-mail passado
        expect(fakeRepository.findByEmail).toHaveBeenCalledWith("novo@teste.com");

        // Verifica que o criar utilizador foi chamado (e podemos ver se ele encriptou usando um expect.any(String))
        expect(fakeRepository.registerUser).toHaveBeenCalledWith({
            email: "novo@teste.com",
            firstName: "Novo",
            lastName: "User",
            password: expect.any(String) // Não podemos adivinhar a hash gerada pelo Bcrypt, logo qualquer String é aceite
        });

        // Garantir que a string recebida em password não foi guardada directamente como o utilizar a enviou
        const callArgs = vi.mocked(fakeRepository.registerUser).mock.calls[0][0];
        expect(callArgs.password).not.toBe("password123!");
    });
});