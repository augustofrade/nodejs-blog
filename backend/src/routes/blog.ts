import { blogAuthorization } from './../middleware/blogAuthorization';
import { verifyToken } from './../middleware/verifyToken';
import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";

const router = Router();

router
    .route("/:slug?")
    .get(BlogController.get);

router.use(verifyToken);

router
    .route("/create")
    .post(BlogController.create);


router.use(blogAuthorization);

router
    .route("/update")
    .post(BlogController.update);

router
    .route("/update-slug")
    .post(BlogController.updateSlug)

router
    .route("/delete")
    .post(BlogController.delete);

export default router;