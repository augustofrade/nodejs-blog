import express from "express";
import AuthController from "../controllers/auth.controller";
import { userAlreadyAuthenticated } from "../middleware/userAlreadyAuthenticated";

const router = express.Router();

router
    .route("/register")
    .post(AuthController.register);

router
    .route("/authenticate")
    .post(userAlreadyAuthenticated, AuthController.authenticate);

router
    .route("/logout")
    .get(AuthController.logout);

export default router;