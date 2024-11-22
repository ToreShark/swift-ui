import { ProductListItemDto } from "./ProductListItemDto.dto";

export class PaginatedProductsResponseDto {
    data: ProductListItemDto[];
    total: number;
    page: number;
    limit: number;
  }
  