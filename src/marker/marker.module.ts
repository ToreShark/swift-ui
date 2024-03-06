import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Marker, MarkerSchema} from "./marker.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Marker.name, schema: MarkerSchema }])],
    controllers: [],
    providers: [],
    exports: [MongooseModule]
})
export class MarkerModule {}
