import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Marker } from "../marker/marker.schema";

@Schema({ collection: 'Products' })
export class Product extends Document {
    @Prop({ required: true, type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string; 

    @Prop()
    productModel: string; 

    @Prop()
    price: string;

    @Prop()
    mainPhoto: Buffer;

    @Prop({ type: [Buffer] })
    photos: Buffer[];

    @Prop()
    temperature: string;

    @Prop()
    technology: string;

    @Prop()
    hairColor: string;

    @Prop()
    skinColor: string;

    @Prop()
    details: string;

    @Prop()
    application: string;

    @Prop()
    composition: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Marker' }] })
    markers: Marker[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    relatedProducts: Product[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
