import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Group} from "../groups/group.schema";
import {Model, Types} from "mongoose";
import {Product} from "../products/products.schema";
import {Filter} from "../filter/filter.group";
import {Marker} from "../marker/marker.schema";

@Injectable()
export class SeedService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<Group>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Filter.name) private filterModel: Model<Filter>,
        @InjectModel(Marker.name) private markerModel: Model<Marker>,
    ) {}

    async seedGroups(): Promise<void> {
        await this.groupModel.deleteMany({})
        const products = await this.seedProducts(); // Товары специфичные для ухода за кожей лица
        const productIds = products.map(product => product._id);

        const filters = await this.seedFilters(); // Фильтры, соответствующие категории ухода за кожей лица
        const filterIds = filters.map(filter => filter._id);

        // Создаем группу "Уход за кожей лица"
        const group = new this.groupModel({
            _id: new Types.ObjectId(),
            name: 'Уход за кожей лица',
            details: 'Продукты для ежедневного ухода за кожей лица, включая кремы, сыворотки и маски',
            items: productIds,
            filters: filterIds,
            picture: Buffer.from('somepicturedata', 'base64'), // Предполагаем, что это демонстрационное изображение
        });

        await group.save();

        console.log('Seeding groups complete!');
    }

    async seedProducts(): Promise<Product[]> {
        // Удаление существующих продуктов для чистого seeding (опционально)
        await this.productModel.deleteMany({});

        const markers = await this.seedMarkers();

        const products = [
            new this.productModel({
                _id: new Types.ObjectId(),
                name: 'Увлажняющий крем для лица',
                productModel: 'Model 1',
                price: '500',
                mainPhoto: Buffer.from('somephoto', 'base64'),
                temperature: 'Для всех температур',
                technology: 'Гидратация',
                hairColor: '',
                skinColor: 'Все типы',
                details: 'Идеален для сухой кожи, обеспечивает 24-часовое увлажнение.',
                application: 'Наносить на чистую кожу лица утром и вечером.',
                composition: 'Вода, глицерин, масла...',
                markers: [markers.find(marker => marker.secondaryWord === 'Сухая')._id],
            }),
            // Добавьте столько продуктов, сколько нужно
        ];

        await Promise.all(products.map(product => product.save()));
        console.log('Seeding products complete!');

        return products;
    }

    async seedFilters(): Promise<Filter[]> {
        await this.filterModel.deleteMany({});

        const filtersData = [
            { primaryWord: 'Все' },
            { primaryWord: 'Хиты' },
            { primaryWord: 'Скидки' },
            { primaryWord: 'Наценки' },
            { primaryWord: 'Холодные' },
            { primaryWord: 'Теплые' },
            { primaryWord: 'Мокрые' },
        ];

        const filters = filtersData.map(filter => new this.filterModel({
            _id: new Types.ObjectId(),
            ...filter,
        }));

        await Promise.all(filters.map(filter => filter.save()));

        console.log('Filters seeding complete!');
        return filters;
    }
    async seedMarkers(): Promise<Marker[]> {
        await this.markerModel.deleteMany({});

        const markers = [
            new this.markerModel({
                _id: new Types.ObjectId(),
                secondaryWord: 'Сухая',
            }),
            new this.markerModel({
                _id: new Types.ObjectId(),
                secondaryWord: 'Гидратация',
            }),
            // Добавьте столько маркеров, сколько нужно
        ];

        await Promise.all(markers.map(marker => marker.save()));
        console.log('Seeding markers complete!');

        return markers;
    }
}
