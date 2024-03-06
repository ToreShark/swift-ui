import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

@Schema()
export class Filter extends Document {
    @Prop({ required: true, type: Types.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    primaryWord: String;
}

export const FilterSchema = SchemaFactory.createForClass(Filter);