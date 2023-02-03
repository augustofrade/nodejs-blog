import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { User } from "../model/User";
import generatePostId from "../utils/generatePostId";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comment {
    @prop({ default: () => generatePostId(), index: true })
    public _publicId?: string;

    @prop({ ref: () => User, required: true })
    public user!: Ref<User>;

    @prop({ required: true })
    public content!: string;

    @prop({ default: [], ref: () => User })
    public upvotes!: Ref<User>[];
}