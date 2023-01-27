import { prop, modelOptions } from "@typegoose/typegoose";


@modelOptions({ schemaOptions: { _id: false } })
export class UserConfig {
    @prop({ default: false })
    public showEmail?: boolean;
}
