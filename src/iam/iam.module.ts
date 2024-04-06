import { forwardRef, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptServic } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule),],
  providers: [{
    provide: HashingService,
    useClass: BcryptServic, 
  }, AuthenticationService,],
  controllers: [AuthenticationController]
})
export class IamModule {}
