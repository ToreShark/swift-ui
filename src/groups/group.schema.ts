import {Filter} from "../filter/filter.group";
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Product} from "../products/products.schema";

@Schema({ collection: 'Groups' })
export class Group extends Document {
    @Prop({required: true, type: Types.ObjectId})
    _id: Types.ObjectId;

    @Prop({required: true})
    name: String;

    @Prop()
    details: String;

    @Prop({type: [{type: Types.ObjectId, ref: 'Products'}]})
    items: Product[];

    @Prop()
    picture: Buffer;

    @Prop({type: [{type: Types.ObjectId, ref: 'Filter'}]})
    filters: Filter[];
}
export const GroupSchema = SchemaFactory.createForClass(Group);