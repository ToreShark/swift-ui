import { IsPhoneForCountries } from "src/iam/service/IsPhoneForCountries";

export class CreateUserDto {
    @IsPhoneForCountries(['RU', 'KZ'])
    phone: string;
}
