import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Marker, MarkerSchema} from "./marker.schema";
import { MarkerService } from './marker.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Marker.name, schema: MarkerSchema }])],
    controllers: [],
    providers: [MarkerService],
    exports: [MarkerService, MongooseModule]
})
export class MarkerModule {}
