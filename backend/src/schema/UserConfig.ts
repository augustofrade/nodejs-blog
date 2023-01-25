import { prop } from "@typegoose/typegoose";

export class UserConfig {
    @prop({ default: false })
    public showEmail?: boolean;
}
