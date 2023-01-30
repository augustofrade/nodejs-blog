import { RefreshToken } from './../types/interface';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HTTPErrorResponse } from "../types/interface";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.token;
    if(!token)
        return res.status(401).json(<HTTPErrorResponse>{ error: true, msg: "User not authenticated" })
    jwt.verify(
        token,
        <string>process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
            if(err || !(<RefreshToken>payload).idUser) {
                res.clearCookie("token");
                return res.status(401).json(<HTTPErrorResponse>{ error: true, msg: "User not authenticated" });
            } else {
                res.locals.userId = (<RefreshToken>payload).idUser;
                next();
            }

        }
    )
};