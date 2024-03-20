import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Marker} from "./marker.schema";
import {Model} from "mongoose";

@Injectable()
export class MarkerService {
    constructor(@InjectModel(Marker.name) private markerModel: Model<Marker>) {}

    async listAllMarkers(): Promise<Marker[]> {
        try {
            return await this.markerModel.find().exec();
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при получении списка маркеров');
        }
    }
}
