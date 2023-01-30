import { Request, Response } from "express";
import { User } from "../model/User";
import { UserModel } from "../model/models";
import { HTTPErrorResponse } from "../types/interface";
import generateRefreshToken from "../utils/generateRefreshToken";

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

    static async authenticate(req: Request, res: Response) {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if(!user)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Invalid user" });

        const passwordIsCorrect = await user.verifyPassword(password);
        if(!passwordIsCorrect)
            return res.status(403).json({ msg: "Invalid password" });
        
        const newToken = generateRefreshToken({ username: user.username, id: user._id, email: user.email });
        
        // TODO: Add auth token registration on UserModel for session control

        const today = new Date();
        const expirationDate = new Date(today.setDate(today.getDate() + 30));

        res.cookie("token", newToken, { expires: expirationDate });
        res.json({ msg: "Authenticated successfuly" });
    }
}