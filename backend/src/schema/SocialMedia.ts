import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
export class SocialMedia {
    @prop()
    public name!: string;
    @prop()
    public url!: string;
}