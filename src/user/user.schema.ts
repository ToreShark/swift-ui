import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {Order} from "../order/order.schema";

@Schema()
export class User extends Document {
    @Prop({ required: true })
    _id: String;

    @Prop({ required: true })
    name: String;

    @Prop({ required: true })
    email: String;

    @Prop({ required: true })
    password: String;

    @Prop()
    address: String;

    @Prop()
    firstName: String;

    @Prop()
    lastName: String;

    @Prop()
    userName: String;

    @Prop()
    country: String;

    @Prop()
    city: String;

    @Prop()
    index: String;

    @Prop()
    phone: String;

    @Prop()
    lastSeenAt: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
    orders: Order[];
}

export const UserSchema = SchemaFactory.createForClass(User);