import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
export class UserName {
    @prop({ minlength: 3, maxLength: 20 })
    public firstName?: string;
    @prop({ minLength: 3, maxLength: 20 })
    public lastName?: string;
}