import express from "express";
import { verifyToken } from './../middleware/verifyToken';
import PostsController from "../controllers/post.controller";

const router = express.Router();

router
    .route("/get/:id")
    .get(PostsController.getData);

router
    .route("/blog/:slug")
    .get(PostsController.getFromBlog);

router.use(verifyToken);

router
    .route("/create")
    .post(PostsController.create);


router
    .route("/update")
    .post(PostsController.update);

router
    .route("/delete")
    .post(PostsController.delete);

export default router;