import {Controller, Get, Query} from '@nestjs/common';
import {FilterProductsDto} from "./dto/FilterProductsDto";
import {FilterService} from "./filter.service";

@Controller('filter')
export class FilterController {
    constructor(private readonly filterService: FilterService) {}

    @Get('products')
    async findProductsByFilter(@Query() filterProductsDto: FilterProductsDto) {
        return await this.filterService.findByFilters(filterProductsDto);
    }
}
