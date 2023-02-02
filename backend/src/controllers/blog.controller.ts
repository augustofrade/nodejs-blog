import { HTTPErrorResponse, HTTPDefaultResponse } from './../types/interface';
import { BlogModel, UserModel, PostModel } from "../model/models";
import { Request, Response } from "express";
import generateSlug from '../utils/generateSlug';

export abstract class BlogController {

    static async get(req: Request, res: Response) {
        const slug: string | undefined = req.params.slug;
        if(!slug)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Blog access name required." });

        BlogModel.getDataBySlug(slug)
            .then(data => {
                console.log(data?.populated("posts"));
                if(!data)
                    res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Blog not found" });
                else
                    res.status(200).json(data);
            })
            .catch(err => {
                res.status(500).json(<HTTPErrorResponse>{ error: true, msg: "Error while fetching blog data. Try again later." });
            });

    }

    static async create(req: Request, res: Response) {
        const userId = res.locals.userId;
        if(!userId)
            return res.status(400).json(<HTTPErrorResponse>{ error: true, msg: "Internal Error" });
    
        const { name, config } = req.body;
        const slug: string | undefined = req.body.slug ? generateSlug(req.body.slug) : undefined; // enforce slug format

        if(!slug)
            return res.status(400).json(<HTTPErrorResponse>{ error: true, msg: "Invalid blog access name" });
        
        const slugInUse = !!await BlogModel.findOne({ slug });

        if(slugInUse)
            return res.json(<HTTPErrorResponse>{ error: true, msg: "Blog access name already in use" });
        
        const newBlog = new BlogModel({ name, config, slug, creator: userId });
        newBlog.save()
            .then(async (blogData) => {
                UserModel.findById(userId).then(user => {
                    user?.blogs.push(blogData._id);
                    user?.save();
                });
                res.status(201).json(<HTTPDefaultResponse>{ msg: "Blog created successfuly", data: blogData })
            })
            .catch(error => {
                res.json({ error });
            })
    }

    
    static async update(req: Request, res: Response) {
        const { name, about, config, slug, collaborators } = req.body;
        const blog = await BlogModel.findOne({ slug });
        
        if(name) blog!.name = name;
        if(about) blog!.about = about;
        // TODO: create invitation logic for blog collaborators
        if(config) blog!.config = config;
        blog!.save()
            .then(blogData => res.status(200).json({ msg: "Blog updated successfuly", data: blogData }))
            .catch(error => res.status(200).json({ error }));
    }

    static async updateSlug(req: Request, res: Response) {
        let newSlug: string | undefined = req.body.newSlug;
        if(!newSlug)
            return res.json(<HTTPErrorResponse>{ error: true, msg: "New blog access name not given" });
        if(newSlug === req.body.slug)
            return res.json({ msg: "New blog access name is the same as the actual name" });

        const blog = await BlogModel.findOne({ slug: req.body.slug });
        newSlug = generateSlug(req.body.newSlug);
        blog!.slug = newSlug;
        blog!.save()
            .then(_ => res.status(200).json({ msg: `Slug updated successfuly to ${newSlug}` }))
            .catch(error => res.status(200).json({ error }));
    }

    static async delete(req: Request, res: Response) {
        const { slug } = req.body;

        const blog = await BlogModel.findOne({ slug })!;
        try {
            const userUpdate = await UserModel.updateMany({ blogs: blog!._id }, {
                $pull: {
                    blogs: blog!._id
                }
            });
            const postsDeleted = await PostModel.deleteMany({ blog: blog!._id });
            if(userUpdate.acknowledged && postsDeleted.acknowledged) {
                blog!.delete();
                res.json({ msg: "Blog deleted Successfuly" });
            } else {
                res.json(<HTTPErrorResponse>{ error: true, msg:"Blog deletion failed" })
            }
        } catch (err) {
            res.json(<HTTPErrorResponse>{ error: true, msg:"Blog deletion failed" })
        }
    }
}