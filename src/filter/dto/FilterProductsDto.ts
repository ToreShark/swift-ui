import {Types} from "mongoose";

export class FilterProductsDto {
    readonly colorCategory: string;
    readonly primaryWord?: string;

    // ID маркера
    markers?: Types.ObjectId[];
    filterId?: Types.ObjectId;

    // Дополнительные параметры фильтрации (опционально)
    readonly priceRange?: PriceRange;
    readonly temperature?: string;
    readonly technology?: string;
    readonly hairColor?: string;
    readonly skinColor?: string;
}