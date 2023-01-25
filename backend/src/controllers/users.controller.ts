import { Request, Response } from "express";
import { UserModel } from "../model/User";

abstract class UsersController {
    static async getAll(req: Request, res: Response) {
        const users = await UserModel.find();
        res.json(users);
    }

    static async getProfile(req: Request, res: Response) {
        res.json({ msg: "abc" });
    }
}