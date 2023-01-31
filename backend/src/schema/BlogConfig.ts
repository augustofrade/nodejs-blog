import { modelOptions } from '@typegoose/typegoose';
import { pre, prop } from '@typegoose/typegoose';
import { BlogColors, BlogFontFamilies } from '../types/enum';

@modelOptions({ schemaOptions: { _id: false } })
export class BlogConfig {
    @prop({ enum: BlogColors })
    public color!: string;

    @prop({ enum: BlogFontFamilies })
    public fontFamily!: string;
}