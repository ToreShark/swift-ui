import {Module} from '@nestjs/common';
import {SeedService} from './seed.service';
import {GroupModule} from "../groups/group.module";
import {FilterModule} from "../filter/filter.module";
import {ProductModule} from "../products/product.module";
import {MongooseModule} from "@nestjs/mongoose";
import {SeedController} from "./seed.controller";
import {MarkerModule} from "../marker/marker.module";

@Module({
    imports: [
        GroupModule,
        FilterModule,
        ProductModule,
        MarkerModule,
    ],
    providers: [SeedService],
    controllers: [SeedController]
})
export class SeedModule {
}
