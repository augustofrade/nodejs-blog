import { HTTPErrorResponse, HTTPDefaultResponse } from './../types/interface';
import { User } from "../model/User";
import { UserModel } from "../model/models";
import { Request, Response } from "express";

export default abstract class UserController {

    static async getProfile(req: Request, res: Response) {
        const username = req.params.username;
        let userProfile;
        
        if(res.locals.username == username) {
            // TODO: get all user's own profile information
            userProfile = await UserModel.getProfileByUsername(username);
        } else {
            userProfile = await UserModel.getProfileByUsername(username);
        }
        
        if(!userProfile)
            res.json(<HTTPErrorResponse>{ error: true, msg: "User not found" });
        else
            res.json(userProfile);
    }

    static async updateProfile(req: Request, res: Response) {
        const userId = res.locals.userId;
        const { email, name, birth, picture, country, description, socialMedia } = req.body;
        UserModel.findByIdAndUpdate(userId, { email, name, birth, picture, country, description, socialMedia });
        res.json({ msg: "Profile Updated Successfuly" })
    }
}