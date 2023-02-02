import express from "express";
import { verifyToken } from './../middleware/verifyToken';
import PostsController from "../controllers/post.controller";

const router = express.Router();

router
    .route("/blog/:slug")
    .get(PostsController.getFromBlog);

router.use(verifyToken);

router
    .route("/create")
    .post(PostsController.create);

export default router;