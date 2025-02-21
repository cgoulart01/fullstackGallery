import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from '../schemas/item.schema';
import { SupabaseService } from '../../supabase/supabase.service';
import { Express } from 'Multer';
import { CreateItemDto } from '../dto/create-item.dto';
@Injectable()
export class ItemsRepository {
  constructor(@InjectModel(Item.name) private readonly itemModel: Model<Item>, private readonly supabaseService: SupabaseService,) { }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) throw new NotFoundException(`item with id ${id} not found`);
    return item;
  }

  async create(title: string, description: string, file: Express.Multer.File): Promise<Item> {

    const itemUrl = await this.supabaseService.uploadItem(file);
    const itemData = {
      title,
      description,
      url: itemUrl,
    };
    return this.itemModel.create(itemData);
  }

  async update(id: string, title?: string, file?: Express.Multer.File): Promise<Item> {
    const existingItem = await this.itemModel.findById(id);
    if (!existingItem) {
      throw new NotFoundException('item não encontrada.');
    }
    let itemUrl = existingItem.url;
    let titleToUpdate = existingItem.title;



    if (title && title.trim() !== '' && title !== existingItem.title) {
      titleToUpdate = title;
    }
    if (title && title.trim() !== '' && title !== existingItem.title) {
      titleToUpdate = title;
    }


    if (file) {
      const filename = existingItem.url?.split('/').pop();

      if (filename) {
        await this.supabaseService.deleteItem(filename);
      } else {
        console.warn('⚠️ Nenhum filename encontrado para deletar.');
      }

      itemUrl = await this.supabaseService.uploadItem(file);
    }

    if (titleToUpdate !== existingItem.title || itemUrl !== existingItem.url) {
      existingItem.title = titleToUpdate;
      existingItem.url = itemUrl;
      await existingItem.save();
    }

    return existingItem;
  }


  async delete(id: string): Promise<Item> {
    const deleteditem = await this.itemModel.findByIdAndDelete(id).exec();
    if (!deleteditem) throw new NotFoundException(`item with id ${id} not found`);
    return deleteditem;
  }
}
