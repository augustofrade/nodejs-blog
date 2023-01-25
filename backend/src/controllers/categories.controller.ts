import { Request, Response } from "express";
import { CategoryModel, Category } from "../model/Category";

abstract class CategoriesController {
    static async getAll(req: Request, res: Response): Promise<void> {
        res.json({ msg: "All categories" });
    }

    static async createCategory(req: Request, res: Response): Promise<void> {
        const categoryName: string = req.body.name;

        const newCategory = new CategoryModel({ name: categoryName });
        newCategory.save()
            .then(category => {
                res.json({ msg: "Added category", data: category });
            })
            .catch(err => {
                res.json({ error: true, msg: err.message });
            });
    }
}

export default CategoriesController;