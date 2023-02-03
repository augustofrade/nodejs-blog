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
        const userId = res.locals.userId;
        const post = await PostModel.findOne({ "comments._publicId": id });
        if(!post)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Failed to upvote the comment" });
        let msg;
        try {
            post.comments!.forEach(comment => {
                if(comment._publicId == id) {
                    if(comment.upvotes.includes(userId)) {
                        comment.upvotes = comment.upvotes.filter(u => u._id != userId);
                        msg = "Comment upvoted";
                    } else {
                        comment.upvotes.push(userId);
                        msg = "Upvote removed";
                    }
                }
            })
            post.save();
            res.status(200).json({ msg });
        } catch (error) {
            res.json(<HTTPErrorResponse>{ error: true, msg: "Failed to upvote comment" });
        }
            
    }
}