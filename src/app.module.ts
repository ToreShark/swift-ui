import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DatabaseModule} from "./db/database.module";
import {GroupModule} from "./groups/group.module";
import {MongooseModule} from "@nestjs/mongoose";
import { SeedModule } from './seed/seed.module';
import {ProductModule} from "./products/product.module";
import {FilterModule} from "./filter/filter.module";
import { MarkerModule } from './marker/marker.module';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true
      }
    ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    GroupModule,
    ScheduleModule.forRoot(),
    SeedModule,
      ProductModule,
      FilterModule,
      MarkerModule,
      UsersModule,
      IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
