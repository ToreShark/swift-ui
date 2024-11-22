import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './group.schema';
import { Model, Types } from 'mongoose';
import { FilterProductsDto } from '../filter/dto/FilterProductsDto';
import { Product } from '../products/products.schema';
import { FindGroupDto } from './group.dto/group.dto';
import { IGroup } from './interface/IGroup';
import { FilterService } from '../filter/filter.service';
import { MarkerService } from '../marker/marker.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<IGroup>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private filterService: FilterService,
    private markerService: MarkerService,
    private productService: ProductsService,
  ) {}

  async findByIdWithProducts(
    findGroupDto: FindGroupDto,
  ): Promise<Group | null> {
    try {
      const objectId = new Types.ObjectId(findGroupDto.id);
      const result = await this.groupModel
        .findOne({ _id: objectId })
        .populate('items')
        .exec();

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
  async listAllGroups(options?: { skip?: number; limit?: number }): Promise<IGroup[]> {
    const query = this.groupModel.find();
  
    // Применяем skip и limit, если они указаны
    if (options?.skip) query.skip(options.skip);
    if (options?.limit) query.limit(options.limit);
  
    return query.populate('items').exec();
  }
  

  async listAllWithPagination(page: number, pageSize: number): Promise<any[]> {
    try {
      const skip = (page - 1) * pageSize;
      // Получаем только нужное количество групп
      const groups = await this.groupModel
        .find()
        .sort({ _id: -1 }) // Сортировка по id в обратном порядке (новые первыми)
        .skip(skip)
        .limit(pageSize)
        .lean();

      // Далее используйте ту же логику для фильтров, маркеров и продуктов.
      const filters = await this.filterService.listAllFilters();
      const markers = await this.markerService.listAllMarkers();
      const products = await this.productService.listAllProducts();

      return groups.map((group) => {
        const groupFilters = filters.filter(
          (filter) =>
            Array.isArray(group.filters) &&
            group.filters.some((groupFilter) =>
              groupFilter._id.equals(filter._id),
            ),
        );

        const enrichedProducts = products
          .filter((product) =>
            group.items.some((itemId) => itemId.equals(product._id)),
          )
          .map((product) => {
            const productMarkers = markers.filter(
              (marker) =>
                Array.isArray(product.markers) &&
                product.markers.some((productMarker) =>
                  productMarker._id.equals(marker._id),
                ),
            );

            return {
              ...product.toJSON(),
              markers: productMarkers.map((marker) => ({
                _id: marker._id.toString(),
                secondaryWord: marker.secondaryWord,
              })),
            };
          });

        return {
          ...group.toJSON(),
          filters: groupFilters,
          items: enrichedProducts,
        };
      });
    } catch (error) {
      console.error('Error fetching paginated data:', error);
      throw new InternalServerErrorException('Error fetching paginated data');
    }
  }
}
