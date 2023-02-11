import { generateEmailToken } from "./../email/generateEmailToken";
import { Types } from "mongoose";
import { pre, modelOptions, ReturnModelType, prop, Ref, DocumentType } from "@typegoose/typegoose";
import bcrypt from "bcrypt";

import { UserConfig } from "../schema/UserConfig";
import { SocialMedia } from "./../schema/SocialMedia";
import { UserName } from "./../schema/UserName";
import { Post } from "./Post";
import { Blog } from "./Blog";
import { Token } from "../schema/Token";


@pre<User>("save", function(next) {
    const user = this;
    const saltFactor = 10;
    if(!user.isModified("password")) return next();
    bcrypt.genSalt(saltFactor, function (err, salt) {
        if(err) return next(err);
        
        bcrypt.hash(<string>user.password, salt, function (err, hashedPassword) {
            if(err) return next(err);
            user.password = hashedPassword;
            next();
        });
    });
})
@modelOptions({ schemaOptions: { timestamps: true } })
class User {
    // Auth Properties
    @prop({ index: true, unique: true })
    public username!: string;
    
    @prop({ index: true, unique: true })
    public email!: string;
    
    @prop()
    public password!: string;

    @prop({ default: false })
    public emailConfirmed!: boolean;

    @prop({ default: () => {
        const { hash: _id, expiration } = generateEmailToken();
        return { _id, expiration };
    } })
    public emailToken?: Token;

    /**
     * Unused
     */
    @prop({ default: [], type: [String] })
    public tokens!: Types.Array<string>;

    // Post Management Properties
    
    @prop({ default: [], ref: () => Post })
    public favoritedPosts!: Ref<Post>[];

    // Blog Properties
    @prop({ default: [], ref: () => Blog })
    public blogs!: Ref<Blog>[];

    // Profile Properties
    @prop()
    public name?: UserName

    @prop()
    public birth?: Date;

    @prop()
    public picture?: string;

    @prop()
    public country?: string;

    @prop()
    public description?: string;

    @prop({ default: [], ref: () => User })
    public following?: Ref<User>[];

    @prop({ default: [], ref: () => User })
    public followers?: Ref<User>[];

    @prop()
    public configs?: UserConfig;

    @prop({ default: [], type: [SocialMedia] })
    public socialMedia!: Types.Array<SocialMedia>;

    
    public static async getFullProfileByUsername(this: ReturnModelType<typeof User>, username: string) {
        const user = await this.findOne({ username }, "-password -tokens")
            .populate("followers", "username name picture")
            .populate("following", "username name picture")
            .populate("blogs", "_id slug name");

        return user;
    }

    public static async getProfileByUsername(this: ReturnModelType<typeof User>, username: string) {
        const user = await this.findOne({ username }, "-password -emailConfirmed -tokens -favoritedPosts -configs")
            .populate("followers", "username name picture")
            .populate("following", "username name picture")
            .populate("blogs", "_id slug name");

        return user;
    }

    public async verifyPassword(this: DocumentType<User>, password: string | undefined): Promise<boolean> {
        if(!password) return new Promise<boolean>(resolve => resolve(false));
        const passwordMatch = bcrypt.compare(password, this.password);
        return passwordMatch;
    }
}


export { User };