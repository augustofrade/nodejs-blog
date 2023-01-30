import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../types/interface";

export const userAlreadyAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.token;
    if(!token)
        return next();

    jwt.verify(
        token,
        <string>process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
            if(err || !(<RefreshToken>payload).idUser) {
                res.clearCookie("token");
                next();
            } else {
                res.status(200).json({ msg: "User already authenticated" });
            }

        }
    )
}