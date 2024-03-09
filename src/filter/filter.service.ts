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

    // async findByColorCategory(filterDto: FilterProductsDto): Promise<Product[]> {
    //     return this.productModel.find({ colorCategory: filterDto.colorCategory }).exec();
    // }

    async findByFilters(filterDto: FilterProductsDto): Promise<Product[]> {
        const filterId = new Types.ObjectId(filterDto.filterId);
        console.log('filterId', filterId);
        const filter = await this.filterModel.findById(filterId).exec();
        console.log('filter', filter);
        if (!filter) {
            throw new Error('Filter not found');
        }

        // Шаг 1: Получить все маркеры
        const allMarkers = await this.markerModel.find().exec();
        console.log('allMarkers', allMarkers);

        // Шаг 2: Фильтровать маркеры в приложении
        const markers = await this.markerModel.find({ secondaryWord: filter.primaryWord }).exec();
        if (markers.length === 0) {
            return [];
        }

        const markerIds = markers.map(marker => marker._id);
        console.log('markerIds', markerIds)

        // Шаг 3: Ищем продукты, содержащие эти маркеры
        // Предполагается, что переменная products уже содержит продукты, полученные из MongoDB
        const products = await this.productModel.find({
            "markers": { $in: markerIds }
        }).exec();

        // console.log('Products with marker:', products);

        return products;
    }
}