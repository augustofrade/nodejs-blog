import { PostModel, UserModel } from "./../model/models";
import { Request, Response } from "express";
import { HTTPErrorResponse } from "../types/interface";


export default abstract class CommentController {

    static async addCommentToPost(req: Request, res: Response) {
        const { postId, message: content } = req.body;
        const success = await PostModel.findOneAndUpdate({ _publicId: postId }, { $push: {
            comments: {
                user: res.locals.userId,
                content,
                upvotes: []
            }
        }})
        res.json(success);

    }
    
    static async deleteComment(req: Request, res: Response) {
        const { id } = req.body;
        const post = await PostModel.findOneAndUpdate({ "comments._publicId": id }, {
            $pull: {
                comments: { "_publicId": id }
            }
        });

        if(!post)
            res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Failed to delete the comment" });
        else
            res.status(200).json({ msg: "Comment deleted successfuly" });
    }
    
    static async upvoteComment(req: Request, res: Response) {
        const { id } = req.body;
        // TODO: upvote comment
    }
}