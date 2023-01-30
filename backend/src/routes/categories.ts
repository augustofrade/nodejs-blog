import express from "express";
import CategoriesController from "../controllers/categories.controller";

const router = express.Router();

router
    .route("/all")
    .get(CategoriesController.getAll);

router
    .route("/create")
    .post(CategoriesController.createCategory);


export default router;