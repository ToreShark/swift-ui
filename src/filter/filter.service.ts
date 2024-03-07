import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from 'mongoose';
import {Filter} from "./filter.group";
import {FilterProductsDto} from "./dto/FilterProductsDto";
import {Product} from "../products/products.schema";
import {IGroup} from "../groups/interface/IGroup";
import {Group} from "../groups/group.schema";
import {Marker} from "../marker/marker.schema";

@Injectable()
export class FilterService {
    constructor(
        // @InjectModel(Group.name) private groupModel: Model<IGroup>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Marker.name) private markerModel: Model<Marker>, // Добавляем модель маркера
        @InjectModel(Filter.name) private filterModel: Model<Filter>
    ) {}

    async findByColorCategory(filterDto: FilterProductsDto): Promise<Product[]> {
        return this.productModel.find({ colorCategory: filterDto.colorCategory }).exec();
    }

    async findByFilters(filterDto: FilterProductsDto): Promise<Product[]> {
        if (!filterDto.filterId) {
            throw new Error('Filter ID is required');
        }

        const filterId = new Types.ObjectId(filterDto.filterId); // Приведение к ObjectId, если это необходимо
        const markers = await this.markerModel.find({ "filterIds": filterId }).exec();

        if (markers.length === 0) {
            console.log('No markers found for the given filter ID:', filterDto.filterId);
            return [];
        }

        const markerIds = markers.map(marker => marker._id);
        const products = await this.productModel.find({ markers: { $in: markerIds } }).exec();

        console.log('Filtered products:', products);
        return products;
    }
}