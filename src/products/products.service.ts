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
  
    // Формируем данные в строгом порядке, соответствующем ProductListItemDto
    const formattedData: ProductListItemDto[] = data.map(item => {
      const raw = item.toJSON();
  
      return {
        id: raw._id.toString(), // Первое поле — id
        name: raw.name, // Второе поле — name
        price: raw.price.toString(), // Третье поле — price
        mainPhoto: raw.mainPhoto, // Поле mainPhoto остается Buffer
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
