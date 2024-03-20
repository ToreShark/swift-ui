import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Group} from "./group.schema";
import {Model, Types} from "mongoose";
import {FilterProductsDto} from "../filter/dto/FilterProductsDto";
import {Product} from "../products/products.schema";
import {FindGroupDto} from "./group.dto/group.dto";
import {IGroup} from "./interface/IGroup";
import {FilterService} from "../filter/filter.service";
import {MarkerService} from "../marker/marker.service";

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<IGroup>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        private filterService: FilterService,
        private markerService: MarkerService
    ) {}

    async findByIdWithProducts(findGroupDto: FindGroupDto): Promise<Group | null> {
        try {
            const objectId = new Types.ObjectId(findGroupDto.id);
            const result = await this.groupModel.findOne({ "_id": objectId }).populate('items').exec();

            if (result) {
                const fullResult: Group = result.toObject();

                return fullResult;
            } else {
                return null;
            }
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при выполнении запроса');
        }
    }
    async listAllGroups(): Promise<IGroup[]> {
        return this.groupModel.find().populate('items').exec();
    }

    async listAllWithData(): Promise<any[]> {
        try {
            const groups = await this.listAllGroups();
            const filters = await this.filterService.listAllFilters();
            const markers = await this.markerService.listAllMarkers();

            return groups.map(group => {
                const groupFilters = filters.filter(filter =>
                    Array.isArray(group.filters) && group.filters.some(groupFilter => groupFilter._id.equals(filter._id))
                );

                const enrichedProducts = group.items.map(product => {
                    const productMarkers = markers.filter(marker =>
                        Array.isArray(product.markers) && product.markers.some(productMarker => productMarker._id.equals(marker._id))
                    );

                    return {
                        _id: product._id.toString(),
                        name: product.name,
                        productModel: product.productModel,
                        price: product.price,
                        mainPhoto: product.mainPhoto, // Предполагается, что это URL или base64 строка изображения
                        photos: product.photos, // Предполагается, что это массив URL или base64 строк изображений
                        temperature: product.temperature,
                        technology: product.technology,
                        hairColor: product.hairColor,
                        skinColor: product.skinColor,
                        details: product.details,
                        application: product.application,
                        composition: product.composition,
                        relatedProducts: product.relatedProducts ? product.relatedProducts.map(rp => rp._id.toString()) : [], // Предполагается, что это массив идентификаторов связанных продуктов
                        markers: productMarkers.map(marker => ({
                            _id: marker._id.toString(),
                            secondaryWord: marker.secondaryWord
                        }))
                    };
                });

                return {
                    ...group.toJSON(),
                    filters: groupFilters,
                    items: enrichedProducts
                };
            });
        } catch (error) {
            console.error('Error fetching all data:', error);
            throw new InternalServerErrorException('Error fetching all data');
        }
    }
}