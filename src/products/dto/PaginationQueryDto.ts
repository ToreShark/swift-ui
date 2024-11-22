import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

class PaginationQueryDto {
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;
  
    @IsInt()
    @Min(1)
    @Max(50)
    @Transform(({ value }) => parseInt(value))
    limit?: number = 20;
  }

export { PaginationQueryDto };