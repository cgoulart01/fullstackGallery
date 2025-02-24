import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsController } from './controllers/items.controller';
import { ItemsService } from './services/items.service';
import { ItemsRepository } from './repositories/items.repository';
import { Item, ItemSchema } from '../models/schemas/item.schema';
import { SupabaseModule } from '../config/supabase.module'; // 🔹 Importando SupabaseModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]), // 🔹 Registrando ItemModel
    SupabaseModule, // 🔹 Agora o SupabaseService pode ser injetado
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsRepository],
})
export class ItemsModule { }
