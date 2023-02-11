import { prop } from "@typegoose/typegoose";

export class Token {
    @prop()
    public _id!: string;

    @prop()
    public expiration!: Date;

}