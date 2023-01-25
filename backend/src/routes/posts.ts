import express from "express";
import PostsController from "../controllers/posts.controller";

const router = express.Router();

router
    .route("/all")
    .get(PostsController.getAll);

export default router;