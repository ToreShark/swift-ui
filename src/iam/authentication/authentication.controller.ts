import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorator/auth.decorator';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { AuthType } from './enum/auth-type.enum';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
    constructor(private authService: AuthenticationService) {}


    @Post('signup')
    async sendCode(@Body() body: SignInDto) {
        return this.authService.signInWithPhoneAndPassword(body.phone);
    }

    @HttpCode(HttpStatus.OK)
    @Post('validate')
    async validateUser(@Body() body: SignUpDto) {
        if (!body.phone || !body.code) {
            throw new UnauthorizedException('Phone and code must be provided');
        }

        // Предполагаем, что validateUser теперь возвращает accessToken если пользователь валиден
        const result = await this.authService.validateUser(body.phone, body.code);
        
        if (result.accessToken) {
            return { accessToken: result.accessToken };
        } else {
            throw new UnauthorizedException('Invalid phone number or code');
        }
    }
}
