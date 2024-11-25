import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './products.schema';
import { Model } from 'mongoose';
import { PaginatedProductsResponseDto } from './dto/PaginatedProductsResponseDto';
import { ProductListItemDto } from './dto/ProductListItemDto.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getProducts(page: number, limit: number): Promise<PaginatedProductsResponseDto> {
    const skip = (page - 1) * limit;
  
    const [data, total] = await Promise.all([
      this.productModel
        .find()
        .populate('relatedProducts') // Если это требуется
        .populate('markers') // Если это требуется
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(),
    ]);
  
    // Формируем данные, чтобы вернуть все свойства таблицы
    const formattedData: ProductListItemDto[] = data.map(item => {
      const raw = item.toJSON();
  
      return {
        id: raw._id.toString(), // Конвертация ObjectId в строку
        name: raw.name,
        model: raw.model,
        price: raw.price.toString(), // Конвертация price в строку
        mainPhoto: raw.mainPhoto, // Buffer для основного фото
        photos: raw.photos, // Массив фото
        temperature: raw.temperature,
        technology: raw.technology,
        hairColor: raw.hairColor,
        skinColor: raw.skinColor,
        details: raw.details,
        application: raw.application,
        composition: raw.composition,
        markers: raw.markers, // Поле markers (если populate, то будет массив объектов)
        relatedProducts: raw.relatedProducts, // Поле relatedProducts (если populate, то массив объектов)
      };
    });
  
    return {
      data: formattedData,
      total,
      page,
      limit,
    };
  }

  async listAllProducts(): Promise<Product[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new InternalServerErrorException('Error fetching products');
    }
  }
}
