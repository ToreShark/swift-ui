import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
    constructor(@InjectModel(User.name) private readonly usersRepository: Model<User>,
    private readonly usersService: UsersService) {}

    async signInWithPhoneAndPassword(phone: string): Promise<boolean> {
        let user = await this.usersService.findOneByPhone(phone);
    
        if (!user) {
            user = await this.usersService.createFromPhone(phone);
        }
    
        const otp = this.generateVerificationCode();
        console.log('OTP', otp);
    
        const otpExpirationDate = new Date(Date.now() + 4 * 60 * 1000);
        // Замените 'otp' на 'code' для согласованности с параметрами метода createOTP
        await this.usersService.createOTP(user, { code: otp, expirationDate: otpExpirationDate });
        return true;
    }    
    generateVerificationCode() {
        return Math.floor(1000 + Math.random() * 900);
    }

    async validateUser(phone: string, code: number) {
        const user = await this.usersService.findOneByPhone(phone);
        if (!user) {
          throw new UnauthorizedException('Invalid phone number');
        }
        const otp = await this.usersService.findValidOtp(user, code);
        if (!otp) {
          throw new UnauthorizedException('Invalid code');
        }
        return true;
      }
    // create fetch user id
    
}
