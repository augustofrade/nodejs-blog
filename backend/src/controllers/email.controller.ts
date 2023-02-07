import { generateEmailToken } from './../email/generateEmailToken';
import { Request, Response } from "express";
import { UserModel } from "../model/models";
import EmailTransport from '../email/EmailTransport';

export default abstract class EmailController {

    static async newEmailToken(req: Request, res: Response) {
        const user = await UserModel.findById(res.locals.userId);
        if(!user || user.emailConfirmed)
            return res.json({ msg: "Email already confirmed" });
        
        const token = generateEmailToken();
        user.emailToken = { _id: token.hash, expiration: token.expiration };
        user.save();
        EmailTransport.Instance.sendConfirmationEmail(user.email, token);
        res.json({ msg: "E-mail confirmation sent successfuly" });
    }

    static async verifyEmailToken(req: Request, res: Response) {
        if(!req.body.token)
            return res.json({ error: true, msg: "E-mail confirmation token not provided" });
        
        const user = await UserModel.findOne({ "emailToken._id": req.body.token });
        if(!user)
            return res.json({ error: true, msg: "Invalid e-mail confirmation token" });
        
        if(new Date() > user.emailToken!.expiration)
            return res.json({ error: true, msg: "The e-mail confirmation token has already expired" });

        user.emailToken = undefined;
        user.emailConfirmed = true;
        user.save();
    }
}