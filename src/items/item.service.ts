import { Injectable } from '@nestjs/common';
import { ItemsRepository } from './repositories/item.repository';
import { Item } from './schemas/item.schema';

@Injectable()
export class ItemService {
  constructor(private readonly itemsRepository: ItemsRepository) { }

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.findAll();
  }

  async findOne(id: string): Promise<Item> {
    return this.itemsRepository.findOne(id);
  }

  async create(title: string, description, url: string): Promise<Item> {
    return this.itemsRepository.create(title, description, url);
  }

  async update(id: string, name?: string, url?: string): Promise<Item> {
    return this.itemsRepository.update(id, name, url);
  }

  async delete(id: string): Promise<Item> {
    return this.itemsRepository.delete(id);
  }
}
