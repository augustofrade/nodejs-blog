import { prop } from "@typegoose/typegoose";

export class UserName {
    @prop()
    public firstName?: string;
    @prop()
    public lastName?: string;
}