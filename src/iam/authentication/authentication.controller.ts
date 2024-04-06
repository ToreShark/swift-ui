import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';

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
        const isValid = await this.authService.validateUser(body.phone, body.code);
        
        if (isValid) {
            return { message: 'Successfully registered' };
        } else {
            throw new UnauthorizedException('Invalid phone number or code');
        }
    }
}
