import { Request, Response } from "express";
import { UserModel } from "../model/User";

export default abstract class AuthController {

    static async register(req: Request, res: Response) {
        const { email, username, password } = req.body;
        const newUser = new UserModel({email, username, password });
        newUser.save()
            .then((user) => {
                res.json({ msg: "User successfuly registered", data: user });
            })
            .catch(err => {
                res.json({ error: true, msg: err.message });
            });
    }
}