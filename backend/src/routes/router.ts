import express from "express";
import postsRouter from "./posts";
import categoriesRouter from "./categories";
import authRouter from "./auth";
import userRouter from "./user";
import blogRouter from "./blog";
import commentRouter from "./comment";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/blog", blogRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentRouter);
router.use("/categories", categoriesRouter);

export default router;