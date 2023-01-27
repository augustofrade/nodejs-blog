import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
export class UserName {
    @prop()
    public firstName?: string;
    @prop()
    public lastName?: string;
}