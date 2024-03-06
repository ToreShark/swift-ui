import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Group} from "../groups/group.schema";
import {Model, Types} from "mongoose";
import {Product} from "../products/products.schema";
import {Filter} from "../filter/filter.group";

@Injectable()
export class SeedService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<Group>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Filter.name) private filterModel: Model<Filter>,
    ) {}

    async seedGroups(): Promise<void> {
        await this.groupModel.deleteMany({})
        const products = await this.seedProducts();
        const productIds = products.map(product => product._id);

        const filters = await this.seedFilters();
        const filterIds = filters.map(filter => filter._id);

        const group = new this.groupModel({
            _id: new Types.ObjectId(),
            name: 'Test Group',
            details: 'This is a test group containing some products',
            items: productIds,
            filters: filterIds,
            picture: Buffer.from('somepicturedata', 'base64'),
        });

        await group.save();

        console.log('Seeding groups complete!');
    }

    async seedProducts(): Promise<Product[]> {
        // Удаление существующих продуктов для чистого seeding (опционально)
        await this.productModel.deleteMany({});

        const products = [
            new this.productModel({
                _id: new Types.ObjectId(),
                name: 'Product 1',
                productModel: 'Model 1',
                price: '100',
                mainPhoto: Buffer.from('somephoto', 'base64'),
                // Добавьте дополнительные поля по мере необходимости
            }),
            new this.productModel({
                _id: new Types.ObjectId(),
                name: 'Product 2',
                productModel: 'Model 2',
                price: '200',
                mainPhoto: Buffer.from('somephoto', 'base64'),
                // Добавьте дополнительные поля по мере необходимости
            }),
            // Добавьте столько продуктов, сколько нужно
        ];

        // Сохраняем все продукты одновременно с помощью Promise.all
        await Promise.all(products.map(product => product.save()));
        console.log('Seeding products complete!');

        return products;
    }
    
    async seedFilters(): Promise<Filter[]> {
        await this.filterModel.deleteMany({});

        const filters = [
            new this.filterModel({
                _id: new Types.ObjectId(),
                primaryWord: 'Электроника',
            }),
            new this.filterModel({
                _id: new Types.ObjectId(),
                primaryWord: 'Бытовая техника',
            }),
            // Добавьте столько фильтров, сколько нужно
        ];

        // Сохраняем все фильтры одновременно с помощью Promise.all
        await Promise.all(filters.map(filter => filter.save()));
        console.log('Seeding filters complete!');

        return filters;
    }
}
