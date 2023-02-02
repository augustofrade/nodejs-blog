import { prop, Ref, modelOptions, DocumentType } from '@typegoose/typegoose';

import { BlogConfig } from './../schema/BlogConfig';
import { Post } from './Post';
import { User } from './User';
import { BlogColors, BlogFontFamilies } from '../types/enum';
import { BlogModel } from './models';


@modelOptions({ schemaOptions: { timestamps: true } })
class Blog {
    @prop({ unique: true, index: true })
    public slug!: string;

    @prop({ required: true })
    public name!: string;

    @prop()
    public about?: string;

    @prop({ required: true, default: [], ref: () => Post })
    public posts!: Ref<Post>[];

    @prop({ required: true, ref: () => User })
    public creator!: Ref<User>;

    @prop({ default: [], ref: () => User })
    public collaborators!: Ref<User>[];

    @prop({ required: true, default: {
        color: BlogColors.YELLOW,
        fontFamily: BlogFontFamilies.Helvetica
    } })
    public config!: BlogConfig;

    static getDataBySlug(slug: string) {
        return BlogModel.findOne({ slug })
            .populate("creator", "username name picture")
            .populate("collaborators", "username name picture")
            .populate("posts", "title slug _publicId author categories")
    }

    isUserAuthorized(this: DocumentType<Blog>, userId: string): boolean {
        return this.creator._id == userId || this.collaborators?.filter(c => c._id == userId).length > 0;
    }
}

export { Blog };