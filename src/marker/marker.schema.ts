import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'Marker' })
export class Marker extends Document {
    @Prop({ required: true, type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    secondaryWord: String;
}

export const MarkerSchema = SchemaFactory.createForClass(Marker);