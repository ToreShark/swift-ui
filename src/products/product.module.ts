import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Product, ProductSchema} from "./products.schema";
import { ProductsService } from './products.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
    controllers: [],
    providers: [ProductsService],
    exports: [ProductsService, MongooseModule]
})

export class ProductModule {};