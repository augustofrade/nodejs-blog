import { verifyToken } from './../middleware/verifyToken';
import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";

const router = Router();

router
    .route("/:slug?")
    .get(BlogController.get)

router.use(verifyToken);

router
    .route("/create")
    .post(BlogController.create)

export default router;