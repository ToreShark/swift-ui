import { forwardRef, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptServic } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { UsersModule } from 'src/users/users.module';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { SmsService } from './service/SmsService';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule,
  ],
  providers: [{
    provide: HashingService,
    useClass: BcryptServic, 
  }, 
  {
    provide: APP_GUARD,
    useClass: AuthenticationGuard,
  },
  AccessTokenGuard,
  AuthenticationService,
  SmsService, ],
  controllers: [AuthenticationController]
})
export class IamModule {}
