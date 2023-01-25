import { getModelForClass, pre, modelOptions } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose/lib/prop";
import slugify from "slugify";

@pre<Category>("save", function() {
    const name = this.name as string;
    this._id = slugify(name, {
        replacement: "-",
        lower: true,
        remove: /[*+~.()'"!:%$@]/g
      });
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