import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ItemsModule } from './items/item.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_API || ""),
    ItemsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
