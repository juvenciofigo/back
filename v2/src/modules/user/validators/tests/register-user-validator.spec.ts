import { describe, it, expect, vi } from "vitest";
import { registerUserValidator } from "../register-user-validator.js";
import { Request, Response } from "express";

describe("registerUserValidator", () => {
    // Helper para criar mocks de Request e Response do Express
    const makeMockRes = () => {
        const res: any = {};
        res.status = vi.fn().mockReturnValue(res);
        res.json = vi.fn().mockReturnValue(res);
        return res as Response;
    };

    it("deve chamar next() se todos os campos forem válidos", async () => {
        const req = {
            body: {
                email: "valido@exemplo.com",
                password: "password123",
                firstName: "Joao",
                lastName: "Silva",
            },
        } as Request;
        const res = makeMockRes();
        const next = vi.fn();

        await registerUserValidator(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("deve retornar 400 se o email for inválido", async () => {
        const req = {
            body: {
                email: "email-invalido",
                password: "password123",
                firstName: "Joao",
                lastName: "Silva",
            },
        } as Request;
        const res = makeMockRes();
        const next = vi.fn();

        await registerUserValidator(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('"email" must be a valid email'),
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it("deve retornar 400 se a password for curta (menor que 6)", async () => {
        const req = {
            body: {
                email: "valido@exemplo.com",
                password: "123",
                firstName: "Joao",
                lastName: "Silva",
            },
        } as Request;
        const res = makeMockRes();
        const next = vi.fn();

        await registerUserValidator(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it("deve retornar 400 se faltar o firstName", async () => {
        const req = {
            body: {
                email: "valido@exemplo.com",
                password: "password123",
                lastName: "Silva",
            },
        } as Request;
        const res = makeMockRes();
        const next = vi.fn();

        await registerUserValidator(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});
