import { getModelForClass, pre, modelOptions } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose/lib/prop";
import slugify from "slugify";
import generateSlug from "../utils/generateSlug";

@pre<Category>("save", function(next) {
    const name = this.name as string;
    this._id = generateSlug(name);
    next();
})
@modelOptions({ schemaOptions:{ versionKey: false } })
class Category {
    @prop()
    public _id?: string;
    @prop()
    public name?: string;
}

const CategoryModel = getModelForClass(Category);

export { CategoryModel, Category };