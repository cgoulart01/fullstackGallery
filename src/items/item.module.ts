import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemsRepository } from './repositories/item.repository';
import { Item, ItemSchema } from './schemas/item.schema';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    SupabaseModule,
  ],
  controllers: [ItemController],
  providers: [ItemService, ItemsRepository],
  exports: [ItemService],
})
export class ItemsModule { }
