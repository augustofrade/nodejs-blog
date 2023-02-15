import express from "express";
import AuthController from "../controllers/auth.controller";
import { userAlreadyAuthenticated } from "../middleware/userAlreadyAuthenticated";
import { body } from "express-validator";
import expressValidation from "../middleware/expresss-validation";

const router = express.Router();

router
    .route("/register")
    .post(
        body("email")
            .isEmail().withMessage("Invalid e-mail format"),
        body("username")
            .isLength({ min: 5, max: 30 }).withMessage("Username length invalid. Must be between 5 and 30 characters"),
        body("password")
            .notEmpty().withMessage("Password should not be empty")
            .isLength({ min: 6 }).withMessage("Password should have at least 6 characters"),
        expressValidation,
        AuthController.register
    );

router
    .route("/authenticate")
    .post(
        body("username").isLength({ min: 4, max: 20 }).withMessage("Incorret length").isEmail().withMessage("Should be an email"),
        body("password").isLength({ min: 4 }),
        expressValidation,
        userAlreadyAuthenticated,
        AuthController.authenticate
    );

router
    .route("/logout")
    .get(AuthController.logout);

export default router;