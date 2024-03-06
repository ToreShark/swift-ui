import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Group} from "./group.schema";
import {Model, Types} from "mongoose";
import {FilterProductsDto} from "../filter/dto/FilterProductsDto";
import {Product} from "../products/products.schema";
import {FindGroupDto} from "./group.dto/group.dto";
import {IGroup} from "./interface/IGroup";

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<IGroup>,
        @InjectModel(Product.name) private productModel: Model<Product>
    ) {}

    async findByIdWithProducts(findGroupDto: FindGroupDto): Promise<Group | null> {
        console.log('Начало запроса', findGroupDto.id);
        try {
            const objectId = new Types.ObjectId(findGroupDto.id);
            const result = await this.groupModel.findOne({ "_id": objectId }).populate('items').exec();
            console.log('Результат запроса с populate:', result);

            if (result) {
                const fullResult: Group = result.toObject();

                console.log('Полный результат с populate:', fullResult);
                return fullResult;
            } else {
                console.log('Группа с указанным ID не найдена.');
                return null;
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            throw new InternalServerErrorException('Ошибка при выполнении запроса');
        }
    }
    async listAllGroups(): Promise<IGroup[]> {
        return this.groupModel.find().populate('items').exec();
    }
}