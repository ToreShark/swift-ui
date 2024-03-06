import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Product, ProductSchema} from "./products.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
    controllers: [],
    providers: [],
    exports: [MongooseModule]
})

export class ProductModule {};