import { generateGenericToken } from './../utils/generateGenericToken';
import { DocumentType, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { BlogColors, BlogFontFamilies } from '../types/enum';
import { BlogConfig } from './../schema/BlogConfig';
import { Collaborator } from './../schema/Collaborator';
import { BlogModel } from './models';
import { Post } from './Post';
import { User } from './User';
import EmailTransport from '../email/EmailTransport';


@modelOptions({ schemaOptions: { timestamps: true } })
class Blog {
    @prop({ unique: true, index: true })
    public slug!: string;

    @prop({ required: true, minlength: 8, maxLength: 30 })
    public name!: string;

    @prop({ maxLength: 200 })
    public about?: string;

    @prop({ required: true, default: [], ref: () => Post })
    public posts!: Ref<Post>[];

    @prop({ required: true, ref: () => User })
    public creator!: Ref<User>;

    @prop({ default: [], type: () => [Collaborator] })
    public collaborators!: Types.Array<Collaborator>;

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
        return this.creator._id == userId || this.collaborators?.filter(c => c.user._id == userId && c.accepted).length > 0;
    }
}

export { Blog };