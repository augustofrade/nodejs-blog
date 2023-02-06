import { prop } from "@typegoose/typegoose";
import crypto from "crypto";

export class EmailToken {
    @prop({ default: () => crypto.randomBytes(32).toString("hex") })
    public _id!: string;

    @prop({ default: () => {
        const today = new Date();
        return new Date(today.getTime() + 5 * 60000);
    }})
    public expiration!: Date;

}