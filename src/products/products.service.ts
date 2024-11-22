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
      .populate('markers')
      .populate('relatedProducts')
      .skip(skip)
      .limit(limit)
      .exec(),
    this.productModel.countDocuments(),
  ]);

  const formattedData = data.map(item => ({
    ...item.toJSON(),
    id: item._id.toString(),
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
