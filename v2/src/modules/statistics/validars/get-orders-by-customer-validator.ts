import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const getOrdersByCustomerValidator = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId || "";

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "ID de Cliente inválido." });
    }

    next();
};
