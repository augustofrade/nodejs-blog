import express from "express";
import CommentController from "../controllers/comment.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.use(verifyToken);

router
    .route("/add")
    .post(CommentController.addCommentToPost);

router
    .route("/delete")
    .post(CommentController.deleteComment);

router
    .route("/upvote")
    .get(CommentController.upvoteComment);

export default router;