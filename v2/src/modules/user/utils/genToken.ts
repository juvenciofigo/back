const secretCode: string = process.env.SECRET || "minhaChaveSecretaSuperSegura";
import jwt from "jsonwebtoken";
import { IUser } from "../model/user-interface-model.js";

export class GenerateTokenUtils {
    static execute(user: IUser): string {
        return jwt.sign(
            {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            secretCode,
            { expiresIn: "15d" }
        );
    }
}