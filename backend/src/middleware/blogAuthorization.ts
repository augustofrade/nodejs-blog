import { Request, Response, NextFunction } from "express";
import { UserModel, BlogModel } from "../model/models";
import { HTTPErrorResponse } from "../types/interface";

/**
 * Verifies if any blog has the slug sent to the endpoint and if the current user is its creator
 */
export const blogAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    const { slug, userPassword } = req.body;

    const userId: string | undefined = res.locals.userId;
    const user = await UserModel.findById(userId);
    if(!user)
        return res.status(400).json(<HTTPErrorResponse>{ error: true, msg: "Internal Error" });

    const blog = await BlogModel.findOne({ slug });
    if(!blog)
        return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Blog not found" });
    else if(!await user.verifyPassword(userPassword) || blog.creator._id != userId)
        return res.status(401).json(<HTTPErrorResponse>{ error: true, msg: "User not authorized" });

    res.locals.user = user;
    next();
}