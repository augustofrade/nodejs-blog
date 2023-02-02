import { Types } from 'mongoose';
import { BlogModel, PostModel, UserModel } from './../model/models';
import { Request, Response } from "express";
import { HTTPErrorResponse } from '../types/interface';
// import { ABCModel } from '../model/a';

abstract class PostsController {
    static async getFromBlog(req: Request, res: Response) {
        const { slug } = req.params;
        const blog = await BlogModel.findOne({ slug });
        if(!blog)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Blog not found" });

        const posts = await PostModel.findByBlogId(blog._id);
        
        res.status(200).json(posts);
    }

    static async create(req: Request, res: Response) {
        const { blogSlug, banner, title, content, categories } = req.body;
        
        const blog = await BlogModel.findOne({ slug: blogSlug });
        if(!blog)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Blog not found" });
    
        const isUserAuthorized = blog.isUserAuthorized(res.locals.userId);
        if(!isUserAuthorized)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "User not authorized to make changes on this blog" });

        const newPost = new PostModel({ blog: blog._id, banner, title, content, categories, author: res.locals.userId });
        newPost.save()
            .then(async (data) => {
                await BlogModel.findByIdAndUpdate(blog._id, { $push: { posts: data._id } });
                res.status(200).json({ msg: "Article created successfuly", postId: `${data._id}` });
            })
            .catch(err => res.status(500).json(err));
    }
}

export default PostsController;