import { IsPhoneNumber, Min, MinLength } from "class-validator";
import { IsPhoneForCountries } from "src/iam/service/IsPhoneForCountries";

export class SignInDto {
    @IsPhoneForCountries(['RU', 'KZ'])
    phone: string;
}
