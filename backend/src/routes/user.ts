import { body } from "express-validator";
import UserController from "../controllers/user.controller";
import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import expressValidation from "../middleware/expresss-validation";

const router = Router();

router
    .route("/profile/:username")
    .get(UserController.getProfile);

router.use(verifyToken);

router
    .route("/profile/update")
    .post(
        body("email").notEmpty().trim().isEmail().isLength({ min: 10, max: 100 }).withMessage("Invalid e-mail"),
        body("name").isObject().withMessage("Invalid name format"),
        body("birth").isDate().withMessage("Invalid date format"),
        body("country").notEmpty().trim().isLength({ min: 4, max: 40 }).withMessage("Country name must have between 4 and 40 characters"),
        body("description").optional().trim().isLength({ max: 100 }).withMessage("Profile description length not exceed 100 characters"),
        body("socialMedia").isArray().withMessage("Invalid social media list format"),
        expressValidation,
        UserController.updateProfile
    );

router
    .route("/follow")
    .post(
        body("userId").notEmpty().withMessage("User not found"),
        expressValidation,
        UserController.followUser
    )

export default router;