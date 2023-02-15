import express from "express";
import { body } from "express-validator";
import CommentController from "../controllers/comment.controller";
import expressValidation from "../middleware/expresss-validation";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.use(verifyToken);

router
    .route("/add")
    .post(
        body("postId").notEmpty().withMessage("Post not found"),
        body("content").isLength({ min: 4, max: 200 }).withMessage("Comments must have between 4 and 200 characters"),
        expressValidation,
        CommentController.addCommentToPost
    );

router
    .route("/delete")
    .post(
        body("id").notEmpty().withMessage("Invalid comment"),
        expressValidation,
        CommentController.deleteComment
    );

router
    .route("/upvote")
    .post(
        body("id").notEmpty().withMessage("Invalid comment"),
        expressValidation,
        CommentController.upvoteComment
    );

export default router;