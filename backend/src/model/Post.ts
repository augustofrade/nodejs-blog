import { Types } from 'mongoose';
import { prop, pre, Ref, ReturnModelType } from "@typegoose/typegoose";
import generatePostId from "../utils/generatePostId";
import { User } from './User';
import { Category } from './Category';
import { Comment } from "../schema/Comment";
import generateSlug from '../utils/generateSlug';
import { Blog } from './Blog';

@pre<Post>("save", function() {
    this.slug = generateSlug(this.title);
})
class Post {
    @prop({ default: () => generatePostId() })
    public _publicId!: string;
    
    @prop()
    public slug!: string;

    @prop({ required: true, ref: () => User })
    public author!: Ref<User>;

    @prop({ required: true, ref: () => Blog })
    public blog!: Ref<Blog>;

    @prop()
    public banner?: string;

    @prop({ required: true, minLength: 10, maxLength: 40 })
    public title!: string;

    @prop({ required: true })
    public content!: string;

    @prop({ default: [], type: [Comment] })
    public comments?: Types.Array<Comment>;

    @prop({ required: true, type: [Category] })
    public categories!: Types.Array<Category>;

    static findByBlogId(this: ReturnModelType<typeof Post>, id: string) {
        return this.find({ blog: id }, "-_id _publicId slug title author comments categories");
    }

    static findByPublicId(this: ReturnModelType<typeof Post>, publicId: string) {
        return this.findOne({ _publicId: publicId }, "-_id _publicId slug title author comments categories");
    }
}



export { Post };