import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {User} from "../user/user.schema";
import {Product} from "../products/products.schema";

@Schema()
export class Order extends Document {
    @Prop({ required: true, type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User;

    @Prop()
    orderDate: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    products: Product[];

    @Prop({ required: true })
    status: String;
}

export const OrderSchema = SchemaFactory.createForClass(Order);