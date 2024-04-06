import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

export function IsPhoneForCountries(countries: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isPhoneForCountries',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [countries],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [expectedCountries] = args.constraints;
                    return expectedCountries.some(country => isValidPhoneNumber(value, country));
                }
            }
        });
    };
}