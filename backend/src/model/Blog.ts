import { prop, Ref, modelOptions } from '@typegoose/typegoose';

import { BlogConfig } from './../schema/BlogConfig';
import { Post } from './Post';
import { User } from './User';
import { BlogColors, BlogFontFamilies } from '../types/enum';
import { BlogModel } from './models';


@modelOptions({ schemaOptions: { timestamps: true } })
class Blog {
    @prop({ unique: true })
    public slug!: string;

    @prop({ required: true })
    public name!: string;

    @prop()
    public about?: string;

    @prop({ required: true, default: [], type: () => String })
    public posts!: Ref<Post, string>[];

    @prop({ required: true, ref: () => User })
    public creator!: Ref<User>;

    @prop({ ref: () => User })
    public collaborators?: Ref<User>[];

    @prop({ required: true, default: {
        color: BlogColors.YELLOW,
        fontFamily: BlogFontFamilies.Helvetica
    } })
    public config!: BlogConfig;

    static getDataBySlug(slug: string) {
        return BlogModel.find({ slug })
            .populate("creator", "username name picture")
            .populate("collaborators", "username name picture")
            .populate("posts", "title slug _id author categories")
    }
}

export { Blog };