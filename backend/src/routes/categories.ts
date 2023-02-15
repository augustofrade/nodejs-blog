import express from 'express';

import CategoriesController from '../controllers/categories.controller';

const router = express.Router();

router
    .route("/all")
    .get(CategoriesController.getAll);

export default router;