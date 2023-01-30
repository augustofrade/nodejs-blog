import express from "express";
import postsRouter from "./posts";
import categoriesRouter from "./categories";
import authRouter from "./auth";
import userRouter from "./user";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/posts", postsRouter);
router.use("/categories", categoriesRouter);

export default router;