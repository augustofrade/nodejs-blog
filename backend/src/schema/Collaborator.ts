import { modelOptions, prop, Ref } from "@typegoose/typegoose";

import { User } from "../model/User";
import { Token } from "./Token";

@modelOptions({ schemaOptions: { _id: false } })
export class Collaborator {

    @prop({ required: true, ref: () => User })
    public user!: Ref<User>;

    @prop({ default: () => new Date() })
    public joinDate!: Date;

    @prop({ default: false  })
    public accepted!: boolean;

    @prop()
    public token?: Token;
}