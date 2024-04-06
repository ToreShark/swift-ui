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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://new_user_blya:2AKHOE1lpZYSoPru@cluster0.lgtepjy.mongodb.net/sergey_test_1?retryWrites=true&w=majority'),
    GroupModule,
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
