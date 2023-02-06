import UserController from "../controllers/user.controller";
import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router
    .route("/profile/:username?")
    .get(UserController.getProfile);

router.use(verifyToken);

router
    .route("/profile/update")
    .post(UserController.updateProfile);

router
    .route("/abc")
    .get((req, res) => {
        res.json({teste: req.originalUrl});
    });



export default router;