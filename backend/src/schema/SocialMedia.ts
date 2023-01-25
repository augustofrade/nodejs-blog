import { prop } from "@typegoose/typegoose";

export class SocialMedia {
    @prop()
    public name?: string;
    @prop()
    public url?: string;
}