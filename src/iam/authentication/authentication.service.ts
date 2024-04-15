import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import jwtConfig from '../config/jwt.config';
import { SmsService } from '../service/SmsService';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly usersRepository: Model<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) // 👈
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private smsService: SmsService
  ) {}

  async signInWithPhoneAndPassword(phone: string): Promise<boolean> {
    let user = await this.usersService.findOneByPhone(phone);

    if (!user) {
      user = await this.usersService.createFromPhone(phone);
    }

    const otp = this.generateVerificationCode();
    console.log('OTP', otp);

    try {
      await this.smsService.sendSMS(phone, otp);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error; // Возможно, выбросить исключение для дальнейшей обработки
    }

    const otpExpirationDate = new Date(Date.now() + 4 * 60 * 1000);
    // Замените 'otp' на 'code' для согласованности с параметрами метода createOTP
    await this.usersService.createOTP(user, {
      code: otp,
      expirationDate: otpExpirationDate,
    });
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
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        phone: user.phone,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    user.tokens.push(accessToken);
    await user.save();

    return {
      accessToken,
    };
  }
}
