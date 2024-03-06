import {Module} from '@nestjs/common';
import {SeedService} from './seed.service';
import {GroupModule} from "../groups/group.module";
import {FilterModule} from "../filter/filter.module";
import {ProductModule} from "../products/product.module";
import {MongooseModule} from "@nestjs/mongoose";
import {SeedController} from "./seed.controller";

@Module({
    imports: [
        GroupModule,
        FilterModule,
        ProductModule
    ],
    providers: [SeedService],
    controllers: [SeedController]
})
export class SeedModule {
}
