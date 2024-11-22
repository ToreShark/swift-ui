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
        .select('name price mainPhoto')
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments(),
    ]);

    const formattedData: ProductListItemDto[] = data.map(item => ({
      id: item._id.toString(),
      name: item.name,
      price: item.price, // Now matches string type
      mainPhoto: item.mainPhoto, // Now matches Buffer type
    }));

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
