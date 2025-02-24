import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item } from '../../models/schemas/item.schema';
import { CreateItemDto } from '../../dto/create-item.dto';
import { UpdateItemDto } from '../../dto/update-item.dto';

@Injectable()
export class ItemsRepository {
  constructor(@InjectModel(Item.name) private readonly itemModel: Model<Item>) { }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findById(id: string): Promise<Item> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido. Deve ser um ObjectId do MongoDB.');
    }
    const item = await this.itemModel.findById(id).exec();
    if (!item) throw new NotFoundException(`Item com ID ${id} não encontrado.`);
    return item;
  }

  async create(data: CreateItemDto & { imageUrl: string }): Promise<Item> {
    return this.itemModel.create(data);
  }

  async update(id: string, data: UpdateItemDto & { imageUrl?: string }): Promise<Item> {
    const updatedItem = await this.itemModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updatedItem) {
      throw new NotFoundException(`Erro ao atualizar item com ID ${id}`);
    }
    return updatedItem;
  }

  async delete(id: string): Promise<Item> {
    const item = await this.findById(id);

    const deletedItem = await this.itemModel.findByIdAndDelete(id).exec();
    if (!deletedItem) {
      throw new NotFoundException(`Erro ao deletar item com ID ${id}`);
    }

    return deletedItem;
  }
}
