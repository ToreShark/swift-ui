import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Filter } from './filter.group';
import { FilterProductsDto } from './dto/FilterProductsDto';
import { Product } from '../products/products.schema';
import { IGroup } from '../groups/interface/IGroup';
import { Group } from '../groups/group.schema';
import { Marker } from '../marker/marker.schema';

@Injectable()
export class FilterService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<IGroup>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Marker.name) private markerModel: Model<Marker>, // Добавляем модель маркера
    @InjectModel(Filter.name) private filterModel: Model<Filter>,
  ) {}

  async findByFilters(filterDto: FilterProductsDto): Promise<Product[]> {
    const filterId = new Types.ObjectId(filterDto.filterId);
    const groupId = new Types.ObjectId(filterDto.groupId);

    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new Error('Group not found');
    }

    const filter = await this.filterModel.findById(filterId).exec();
    if (!filter) {
      throw new Error('Filter not found');
    }

    // Шаг 2: Фильтровать маркеры в приложении
    const markers = await this.markerModel
      .find({ secondaryWord: filter.primaryWord })
      .exec();
    if (markers.length === 0) {
      return [];
    }

    const markerIds = markers.map((marker) => marker._id);
    console.log('markerIds', markerIds);

    // Шаг 3: Ищем продукты, содержащие эти маркеры
    const products = await this.productModel
      .find({
        _id: { $in: group.items },
        markers: { $in: markerIds },
      })
      .exec();

    return products;
  }

  async listAllFilters(): Promise<Filter[]> {
    try {
      return await this.filterModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при получении списка фильтров',
      );
    }
  }

  async findAllFiltersFromGroups(): Promise<any[]> {
    try {
      // 1. Получить все группы
      const groups = await this.groupModel.find({}, 'filters').exec();
  
      // 2. Собрать уникальные filterIds из всех групп
      const filterIds = [
        ...new Set(groups.flatMap((group) => group.filters.map((filterId) => filterId.toString()))),
      ];
  
      if (filterIds.length === 0) {
        return []; // Если фильтров нет, возвращаем пустой массив
      }
  
      // 3. Преобразовать filterIds в ObjectId
      const objectIdFilterIds = filterIds.map((id) => new Types.ObjectId(id));
  
      // 4. Получить фильтры по filterIds
      const filters = await this.filterModel
        .find({ _id: { $in: objectIdFilterIds } })
        .exec();
  
      // 5. Вернуть данные фильтров
      const result = filters.map((filter) => ({
        _id: filter._id.toString(),
        primaryWord: filter.primaryWord.trim(), // Убираем лишние пробелы из primaryWord
      }));
  
      return result;
    } catch (error) {
      console.error('Error in findAllFiltersFromGroups:', error);
      throw new InternalServerErrorException('Error while fetching all filters from groups');
    }
  }
}
