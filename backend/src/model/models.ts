import { getModelForClass } from "@typegoose/typegoose";

import { User } from "./User";
import { Blog } from "./Blog";

// Central File To resolve problems with circular dependencies
// between User and Blog Models

export const UserModel = getModelForClass(User);
export const BlogModel = getModelForClass(Blog);