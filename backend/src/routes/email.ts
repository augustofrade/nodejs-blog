import { body } from "express-validator";
import express from "express";
import { verifyToken } from "./../middleware/verifyToken";
import EmailController from "../controllers/email.controller";
import expressValidation from "../middleware/expresss-validation";

const router = express.Router();

router.use(verifyToken);

router
    .route("/token-new")
    .get(EmailController.newEmailToken);

router
    .route("/token-verify")
    .post(
        body("token").notEmpty().withMessage("E-mail confirmation token not provided"),
        expressValidation,
        EmailController.verifyEmailToken
    );

export default router;