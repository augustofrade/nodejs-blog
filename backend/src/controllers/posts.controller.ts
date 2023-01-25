import { Request, Response } from "express";

abstract class PostsController {
    static async getAll(req: Request, res: Response): Promise<void> {
        res.json({ msg: "All posts" });
    }
}

export default PostsController;