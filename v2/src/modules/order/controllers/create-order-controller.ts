import { Response, NextFunction } from "express";
import { Request } from "express-jwt"
import { makeCreateOrder } from "../factories/make-create-order.js";

export async function createOrderController(req: Request, res: Response, next: NextFunction) {
    const { addressId } = req.body;
    const userId = (req as any).auth?._id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Usuário não autenticado" });
    }

    try {
        const createOrderService = makeCreateOrder();
        const result = await createOrderService.execute({
            addressId,
            userId
        });

        return res.status(201).json({
            success: true,
            message: "Pedido criado com sucesso",
            order: result
        });
    } catch (error: any) {
        if (error.message === "Carrinho inválido ou vazio!" || error.message === "Perfil de cliente não encontrado!") {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
}
