import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI', ''), // 🔹 Carrega o URI do Mongo do .env
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule], // 🔹 Agora exporta o MongooseModule para outros módulos
})
export class DatabaseModule { } // 🔹 Certifique-se de que a classe está correta
