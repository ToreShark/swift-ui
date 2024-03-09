import {Types} from "mongoose";

export class FilterProductsDto {
    readonly markerIds: Types.ObjectId[];
    readonly filterId: Types.ObjectId;
}