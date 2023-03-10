import { BlogModel, PostModel, UserModel } from './../model/models';
import { Request, Response } from "express";
import { HTTPErrorResponse } from '../types/interface';

export default abstract class PostsController {
    
    static async getData(req: Request, res: Response) {
        const { id } = req.params;
        const post = await PostModel.findByPublicId(id);
        if(!post)
            res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Post not found" });
        else
            res.json(post);
    }
    
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
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "User not authorized to create posts on this blog" });

        const newPost = new PostModel({ blog: blog._id, banner, title, content, categories, author: res.locals.userId });
        newPost.save()
            .then(async (data) => {
                await BlogModel.findByIdAndUpdate(blog._id, { $push: { posts: data._id } });
                res.status(200).json({ msg: "Post created successfuly", postId: `${data._publicId}` });
            })
            .catch(err => res.status(500).json(err));
    }
    
    static async update(req: Request, res: Response) {
        const { id, title, content, banner, categories } = req.body;
        const postToUpdate = await PostModel.findOne({ _publicId: id });
        if(!postToUpdate)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Post not found" });
        if(postToUpdate.author != res.locals.userId)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "User not authorized" });

        try {
            if(banner) postToUpdate.banner = banner;
            postToUpdate.title = title;
            postToUpdate.content = content;
            postToUpdate.categories = categories;
            postToUpdate.save();
            res.status(200).json({ msg: "Post updated successfuly" });
        } catch(error) {
            res.status(404).json(error);
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.body;
        try {
            const postData = await PostModel.findOneAndDelete({ _publicId: id }, { returnOriginal: true });
            if(!postData)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Post not found "});
            
            await UserModel.updateMany({ "favoritedPosts._id": postData._id }, { $pull: {
                "favoritedPosts": { _id: postData._id }
            }});
            await BlogModel.findByIdAndUpdate(postData.blog, { $pull: { posts: postData._id } });
            
            res.status(200).json({ msg: "Post deleted successfuly" });
        } catch(error) {
            res.json(error);
        }

    }

    static async favorite(req: Request, res: Response) {
        const { id } = req.body;
        const user = await UserModel.findById(res.locals.userId);
        if(!user)
            return res.status(400).json(<HTTPErrorResponse>{ error: true, msg: "Internal error" });

        const post = await PostModel.findOne({ _publicId: id });
        if(!post)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Post not found" });
        
        let msg = "";
        try {

            if(user.favoritedPosts.includes(post._id)) {
                user.favoritedPosts = user.favoritedPosts.filter(p => p._id != post._id);
                msg = "Post removed from your favorites";
            }
            else {
                user.favoritedPosts.push(post._id);
                msg = "Post added to your favorites";
            }
            user.save();
        } catch (err) {
            msg = "Failed adding post to favorites";
        }

        res.json({ msg });
    }
}