import { Types } from 'mongoose';
import { prop, getModelForClass, pre, Ref } from "@typegoose/typegoose";
import generatePostId from "../utils/generatePostId";
import { User } from './User';
import { Category } from './Category';
import { Comment } from "../schema/Comment";
import generateSlug from '../utils/generateSlug';

@pre<Post>("save", function() {
    this.slug = generateSlug(this.title);
})
class Post {
    @prop({ default: () => generatePostId() })
    public _id!: string;
    
    @prop({ required: true })
    public slug!: string;

    @prop({ required: true, type: () => User })
    public author!: Ref<User>;

    @prop()
    public banner?: string;

    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public content!: string;

    @prop({ default: [], type: [Comment] })
    public comments?: Types.Array<Comment>;

    @prop({ required: true, type: [Category] })
    public categories!: Types.Array<Category>;
}

const PostModel = getModelForClass(Post);

export { PostModel, Post };