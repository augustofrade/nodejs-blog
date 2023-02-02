import { getModelForClass } from "@typegoose/typegoose";

import { User } from "./User";
import { Blog } from "./Blog";
import { Post } from "./Post";

// Central File To resolve problems with circular dependencies
// between User and Blog Models

export const UserModel = getModelForClass(User);
export const BlogModel = getModelForClass(Blog);
export const PostModel = getModelForClass(Post);