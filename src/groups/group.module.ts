import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Group, GroupSchema} from "./group.schema";
import {GroupsController} from "./groups.controller";
import {GroupService} from "./group.service";
import {Product, ProductSchema} from "../products/products.schema";
import {FilterModule} from "../filter/filter.module";
import {MarkerModule} from "../marker/marker.module";
import {ProductModule} from "../products/product.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        forwardRef(() => FilterModule),
        MarkerModule,
        ProductModule
    ],
    controllers: [GroupsController],
    providers: [GroupService],
    exports: [GroupService, MongooseModule]
})

export class GroupModule {};