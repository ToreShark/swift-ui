import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from 'src/iam/authentication/decorator/auth.decorator';
import { FilterProductsDto } from './dto/FilterProductsDto';
import { FilterService } from './filter.service';
import { AuthType } from 'src/iam/authentication/enum/auth-type.enum';

@Auth(AuthType.None)
@Controller('filter')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @Get('products')
  async findProductsByFilter(@Query() filterProductsDto: FilterProductsDto) {
    console.log(filterProductsDto);
    return await this.filterService.findByFilters(filterProductsDto);
  }

  @Get('all-filters')
  async findAllFilters() {
    return await this.filterService.findAllFiltersFromGroups();
  }
}
