import { Document, Types } from 'mongoose';
import {Product} from "../../products/products.schema";
import {Filter} from "../../filter/filter.group";

export interface IGroup extends Document {
    _id: Types.ObjectId;
    name: string;
    details?: string; // The question mark (?) makes the property optional
    items: Types.ObjectId[] | Product[]; // Can be an array of ObjectId or Product documents if populated
    picture?: Buffer; // Optional
    filters: Types.ObjectId[] | Filter[]; // Can be an array of ObjectId or Filter documents if populated
}
