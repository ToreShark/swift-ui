import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Product} from "./products.schema";
import {Model} from "mongoose";

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

    async listAllProducts(): Promise<Product[]> {
        try {
            return await this.productModel.find().exec();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new InternalServerErrorException('Error fetching products');
        }
    }
}
