import { Router } from "express";
import { body } from "express-validator";

import { BlogController } from "../controllers/blog.controller";
import expressValidation from "../middleware/expresss-validation";
import { blogAuthorization } from "./../middleware/blogAuthorization";
import { verifyToken } from "./../middleware/verifyToken";

const router = Router();

router
    .route("/:slug")
    .get(BlogController.get);

router.use(verifyToken);

router
    .route("/create")
    .post(
        body("name").trim()
            .notEmpty().withMessage("Blog name must not be empty")
            .isLength({ min: 8, max: 30 }).withMessage("Blog name must have between 8 and 30 characters"),
        body("about").trim().isLength({ max: 200 }).withMessage("Blog description must not exceed 200 characters"),
        body("config").isObject().withMessage("Invalid blog configuration format"),
        expressValidation,
        BlogController.create
    );

router
    .route("/join")
    .post(
        body("token").notEmpty().withMessage("Invalid blog invitation token"),
        expressValidation,
        BlogController.acceptInvitation
    );


router.use(blogAuthorization);

router
    .route("/update")
    .post(
        body("name").trim()
            .notEmpty().withMessage("Blog name must not be empty")
            .isLength({ min: 8, max: 30 }).withMessage("Blog name must have between 8 and 30 characters"),
        body("about").trim().isLength({ max: 200 }).withMessage("Blog description must not exceed 200 characters"),
        body("config").isObject().withMessage("Invalid blog configuration format"),
        body("slug").trim().notEmpty().withMessage("Blog access name must be provided"),
        expressValidation,
        BlogController.update
    );

router
    .route("/update-slug")
    .post(
        body("newSlug").trim()
            .notEmpty().withMessage("New blog access name not provided")
            .isLength({ min: 4, max: 20 }).withMessage("Blog access name must have between 4 and 20 characters"),
        body("slug")
            .notEmpty().withMessage("Blog's current access name not provided"),
        expressValidation,
        BlogController.updateSlug
    );
    
router
    .route("/add-collaborator")
    .post(
        body("username").notEmpty().withMessage("New collaborator's username must be provided"),
        expressValidation,
        BlogController.addCollaborator
    );

router
    .route("/remove-collaborator")
    .post(
        body("username").notEmpty().withMessage("New collaborator's username must be provided"),
        expressValidation,
        BlogController.removeCollaborator
    );


        
router
    .route("/delete")
    .post(
        body("slug").notEmpty().withMessage("Blug slug not provided"),
        expressValidation,
        BlogController.delete
    );


export default router;