import {forwardRef, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Group, GroupSchema} from "./group.schema";
import {GroupsController} from "./groups.controller";
import {GroupService} from "./group.service";
import {Product, ProductSchema} from "../products/products.schema";
import {FilterModule} from "../filter/filter.module";
import {MarkerModule} from "../marker/marker.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        forwardRef(() => FilterModule),
        MarkerModule
    ],
    controllers: [GroupsController],
    providers: [GroupService],
    exports: [MongooseModule]
})

export class GroupModule {};