import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import request from "supertest";

// Mock do Firebase obrigatório porque o app todo é carregado (que inclui imagens)
vi.mock("@/shared/utils/firebase", () => ({
    getBucket: () => ({
        file: () => ({
            createWriteStream: () => ({ on: vi.fn(), end: vi.fn() }),
            delete: vi.fn(),
        }),
        name: "mock-bucket",
    }),
}));

import app from "../../../app.js";
import { MongoTestHelper } from "../../../shared/tests/database-helper.js";
import { UserModel } from "../index.js";

describe("Register User Route E2E", () => {
    // Antes de todos, inicia o BD em RAM (com 5 min de limite, caso seja o primeiro download)
    beforeAll(async () => {
        await MongoTestHelper.connect();
    }, 300000);

    // Depois de todos, fecha o BD
    afterAll(async () => {
        await MongoTestHelper.disconnect();
    });

    // Antes de cada um, limpa as coleções testadas
    beforeEach(async () => {
        await MongoTestHelper.clearDatabase();
    });

    it("1. [Erro Validação] Deve retornar 400 se o email for inválido pelo Joi", async () => {
        const response = await request(app).post("/register").send({
            email: "email-invalido",
            firstName: "Teste",
            lastName: "Usuario",
            password: "passwordforte",
        });

        expect(response.status).toBe(400); // Bad Request (Joi interceptou)
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toMatch(/valid email/);
    });

    it("2. [Sucesso] Deve registar o utilizador com sucesso no MongoDB em memória e devolver Token", async () => {
        const response = await request(app).post("/register").send({
            email: "real@gmail.com",
            firstName: "Real",
            lastName: "User",
            password: "passwordforte",
        });

        // O Express devolve 201 na tua rota de registo presumivelmente
        // Ou 200 dependendo de como o teu UserController está configurado!
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("email", "real@gmail.com");

        // Vamos verificar se realmente está guardado na Collection Real!
        const usersInDb = await UserModel.find({});
        expect(usersInDb.length).toBe(1);
        expect(usersInDb[0].email).toBe("real@gmail.com");
    });

    it("3. [Erro Regra Negócio] Deve retornar erro HTTP ao tentar registar um email já existente", async () => {
        const payload = {
            email: "clone@gmail.com",
            firstName: "Clone",
            lastName: "User",
            password: "passwordforte",
        };

        // Regista o primeiro
        await request(app).post("/register").send(payload);

        // Tenta registar o segundo idêntico
        const response2 = await request(app).post("/register").send(payload);

        // Regra de negócio (BaseError) deve disparar, com algo como status 400 ou 409
        expect([400, 409]).toContain(response2.status);
        expect(response2.body).toHaveProperty("message");
        expect(response2.body.message.toLowerCase()).toContain("already exists".toLowerCase()); // ou a msg que tiveres no BaseError
    });
});
