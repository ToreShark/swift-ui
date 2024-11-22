import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/iam/authentication/decorator/auth.decorator';
import { AuthType } from 'src/iam/authentication/enum/auth-type.enum';
import { PaginationQueryDto } from './dto/PaginationQueryDto';
import { ProductsService } from './products.service';

@Auth(AuthType.None)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(@Query() query: PaginationQueryDto) {
    return this.productsService.getProducts(query.page, query.limit);
  }
}
