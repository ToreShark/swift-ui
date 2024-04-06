import { IsNumber } from "class-validator";
import { IsPhoneForCountries } from "src/iam/service/IsPhoneForCountries";

export class SignUpDto {
    @IsPhoneForCountries(['RU', 'KZ'])
    phone: string;

    @IsNumber()
    code: number;
}
