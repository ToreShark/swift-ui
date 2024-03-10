import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Filter, FilterSchema} from "./filter.group";
import {FilterService} from "./filter.service";
import {ProductModule} from "../products/product.module";
import {MarkerModule} from "../marker/marker.module";
import { FilterController } from './filter.controller';
import {GroupModule} from "../groups/group.module";

@Module({
    imports: [MongooseModule.forFeature([{name: Filter.name, schema: FilterSchema}]),
        ProductModule,
        MarkerModule,
        FilterModule,
        GroupModule
    ],
    controllers: [FilterController],
    providers: [FilterService],
    exports: [MongooseModule]
})

export class FilterModule {
};