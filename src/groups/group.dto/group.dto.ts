import { IsNotEmpty, IsMongoId } from 'class-validator';

export class FindGroupDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;
}