import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
export class SocialMedia {
    @prop({ minlength: 3, maxLength: 15 })
    public name!: string;
    @prop({ minLength: 10, maxLength: 50 })
    public url!: string;
}