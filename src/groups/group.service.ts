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
}
