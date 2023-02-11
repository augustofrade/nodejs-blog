import { HTTPErrorResponse } from './../types/interface';
import { UserModel } from "../model/models";
import { Request, Response } from "express";

export default abstract class UserController {

    static async getProfile(req: Request, res: Response) {
        const username = req.params.username;
        let userProfile;
        
        if(res.locals.username == username) {
            userProfile = await UserModel.getFullProfileByUsername(username);
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

    static async followUser(req: Request, res: Response) {
        const { userId } = req.body;
        const user = await UserModel.findById(res.locals.userId);
        if(!user)
        return res.status(400).json(<HTTPErrorResponse>{ error: true, msg: "Internal error" });

        const userTarget = await UserModel.findById(userId);
        if(!userTarget)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "User not found" });
        
        let msg = "";
        try {
            if(user.following?.includes(userTarget._id)) {
                user.following = user.following.filter(u => u._id != userTarget._id);
                userTarget.followers = userTarget.followers?.filter(u => u._id != user._id);
                msg = userTarget.username + " unfollowed";
            }
            else {
                user.following?.push(userTarget._id);
                userTarget.followers?.push(user._id);
                msg = "Now following " + userTarget.username;
            }
            user.save();
            userTarget.save();
        } catch (err) {
            msg = "Failed to follow " + userTarget.username;
        }

        res.json({ msg });
    }

    // TODO: delete account
}