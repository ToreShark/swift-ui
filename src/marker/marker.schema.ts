import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Marker extends Document {
    @Prop({ required: true, type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    secondaryWord: String;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Filter' }] })
    filterIds: Types.ObjectId[];
}

export const MarkerSchema = SchemaFactory.createForClass(Marker);