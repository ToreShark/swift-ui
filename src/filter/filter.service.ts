import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { Model } from 'mongoose';
import {Filter} from "./filter.group";
import {FilterProductsDto} from "./dto/FilterProductsDto";
import {Product} from "../products/products.schema";
import {IGroup} from "../groups/interface/IGroup";
import {Group} from "../groups/group.schema";

@Injectable()
export class FilterService {
    constructor(
        // @InjectModel(Group.name) private groupModel: Model<IGroup>,
        @InjectModel(Product.name) private productModel: Model<Product>
    ) {}

    async findByColorCategory(filterDto: FilterProductsDto): Promise<Product[]> {
        return this.productModel.find({ colorCategory: filterDto.colorCategory }).exec();
    }
}