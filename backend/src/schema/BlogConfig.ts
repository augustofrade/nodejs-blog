import { pre, prop } from '@typegoose/typegoose';
import { BlogColors, BlogFontFamilies } from '../types/enum';

export class BlogConfig {
    @prop({ enum: BlogColors })
    public color!: string;

    @prop({ enum: BlogFontFamilies })
    public fontFamily!: string;
}