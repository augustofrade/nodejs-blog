import express from "express";
import { verifyToken } from "./../middleware/verifyToken";
import PostsController from "../controllers/post.controller";
import expressValidation from "../middleware/expresss-validation";
import { body } from "express-validator";

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
    .post(
        body("title").notEmpty().trim().isLength({ min: 10, max: 50 }).withMessage("Post title must have between 10 and 50 characters"),
        body("banner").optional().isString().withMessage("Invalid banner"),
        body("content").notEmpty().trim().isLength({ min: 10 }).withMessage("Post content must have at least 10 characters"),
        body("categories").notEmpty().isArray().withMessage("Posts must have at least one category"),
        body("blogSlug").notEmpty().trim().isLength({ min: 10 }),
        expressValidation,
        PostsController.create
    );

router
    .route("/update")
    .post(
        body("id").notEmpty().isString().withMessage("Post not found"),
        body("title").notEmpty().trim().isLength({ min: 10, max: 50 }).withMessage("Post title must have between 10 and 50 characters"),
        body("banner").optional().isString().withMessage("Invalid banner"),
        body("content").notEmpty().trim().isLength({ min: 10 }).withMessage("Post content must have at least 10 characters"),
        body("categories").notEmpty().isArray().withMessage("Posts must have at least one category"),
        expressValidation,
        PostsController.update
    );

router
    .route("/delete")
    .post(
        body("id").notEmpty().withMessage("Post it not provided"),
        expressValidation,
        PostsController.delete
    );

router
    .route("/favorite")
    .post(
        body("id").notEmpty().withMessage("Post it not provided"),
        expressValidation,
        PostsController.favorite
    );

export default router;