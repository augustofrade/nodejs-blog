import { Request, Response } from 'express';
import EmailTransport from '../email/EmailTransport';
import { generateEmailToken } from '../email/generateEmailToken';
import { UserModel } from '../model/models';
import { HTTPErrorResponse } from '../types/interface';
import generateRefreshToken from '../utils/generateRefreshToken';

export default abstract class AuthController {

    static async register(req: Request, res: Response) {
        const { email, username, password } = req.body;
        const emailToken = generateEmailToken();
        const newUser = new UserModel({email, username, password, emailToken });
        newUser.save()
            .then((user) => {
                res.json({ msg: "User successfuly registered", data: user });
                EmailTransport.Instance.sendRegistrationEmail(user.email, username, emailToken);
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

    static async logout(req: Request, res: Response) {
        // TODO: after refresh token is stored in user schema, remove it here too
        res.clearCookie("token");
        res.json({ msg: "User logged out" });
    }
}