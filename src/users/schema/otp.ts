import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ collection: 'OTP' })
export class Otp extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User | Types.ObjectId;

    @Prop({ required: true })
    code: number;

    @Prop({ required: true, expires: 240 })
    expirationDate: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);