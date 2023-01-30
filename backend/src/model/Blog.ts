import { BlogConfig } from './../schema/BlogConfig';
import { pre, prop, getModelForClass, Ref, modelOptions } from '@typegoose/typegoose';
import { Post } from './Post';
import { User } from './User';

// @pre<Blog>("save", function() {
//     // TODO: generate slug
// })
@modelOptions({ schemaOptions: { timestamps: true } })
class Blog {
    @prop()
    public slug!: string;

    @prop()
    public name!: string;

    @prop({ default: [], type: () => String })
    public posts!: Ref<Post, string>[];

    @prop({ ref: () => User })
    public creator!: Ref<User>;

    @prop({ ref: () => User })
    public collaborators?: Ref<User>[];

    @prop()
    public config!: BlogConfig;
}

export { Blog };