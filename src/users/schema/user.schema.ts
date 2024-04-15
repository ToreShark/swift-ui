import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Order } from "../../order/order.schema";

@Schema({ collection: 'Users' })
export class User extends Document {
    @Prop({ required: true, unique: true })
    phone: string;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    address: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    userName: string;

    @Prop()
    country: string;

    @Prop()
    city: string;

    @Prop()
    index: string;

    @Prop()
    lastSeenAt: Date;

    @Prop({ type: [{ type: String, required: true }] })
    tokens: string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
    orders: Types.Array<Order>;
}

export const UserSchema = SchemaFactory.createForClass(User);