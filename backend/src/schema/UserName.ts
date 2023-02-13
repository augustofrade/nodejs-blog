import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
export class UserName {
    @prop({ minlength: 4, maxLength: 20 })
    public firstName?: string;
    @prop({ minLength: 4, maxLength: 20 })
    public lastName?: string;
}