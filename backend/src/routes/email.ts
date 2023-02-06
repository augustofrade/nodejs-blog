import express from "express";
import { verifyToken } from "./../middleware/verifyToken";
import EmailController from "../controllers/email.controller";

const router = express.Router();

router.use(verifyToken);

router
    .route("/token-new")
    .get(EmailController.newEmailToken);

router
    .route("/token-verify")
    .post(EmailController.verifyEmailToken);

export default router;