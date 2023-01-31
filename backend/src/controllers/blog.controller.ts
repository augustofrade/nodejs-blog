import { HTTPErrorResponse, HTTPDefaultResponse } from './../types/interface';
import { BlogModel, UserModel } from "../model/models";
import { Request, Response } from "express";
import generateSlug from '../utils/generateSlug';

export abstract class BlogController {

    static async get(req: Request, res: Response) {
        const slug: string | undefined = req.params.slug;
        if(!slug)
            return res.status(404).json(<HTTPErrorResponse>{ error: true, msg: "Blog access name required." });

        BlogModel.getDataBySlug(slug)
            .then(data => {
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
        
        const { name, config, slug } = req.body;
        const slugInUse = !!await BlogModel.findOne({ slug });

        if(slugInUse)
            return res.json(<HTTPErrorResponse>{ error: true, msg: "Blog access name already in use." });
        
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

    
}