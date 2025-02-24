import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ItemsRepository } from '../repositories/items.repository';
import { Item } from '../../models/schemas/item.schema';
import { CreateItemDto } from '../../dto/create-item.dto';
import { UpdateItemDto } from '../../dto/update-item.dto';
import { SupabaseService } from '../../config/services/supabase.service';
import { Express } from "Multer"
@Injectable()
export class ItemsService {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly supabaseService: SupabaseService
  ) { }

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.findAll();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado.`);
    }
    return item;
  }

  async create(createItemDto: CreateItemDto, file: Express.Multer.File): Promise<Item> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    // Faz o upload da imagem para o Supabase e recebe a URL gerada
    const imageUrl = await this.supabaseService.uploadImage(file);

    // Cria o item no banco de dados com a URL da imagem
    return this.itemsRepository.create({
      ...createItemDto,
      imageUrl,
    });
  }

  async update(id: string, updateItemDto: UpdateItemDto, file?: Express.Multer.File): Promise<Item> {
    const item = await this.itemsRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado.`);
    }

    let imageUrl: string = item.imageUrl; // 🔹 Se nenhum novo arquivo for enviado, mantém a URL existente

    if (file) {
      // Remove a imagem antiga e faz upload da nova
      await this.supabaseService.deleteImage(imageUrl);
      imageUrl = await this.supabaseService.uploadImage(file);
    }

    // 🔹 Criando um objeto de atualização garantindo que `imageUrl` esteja sempre definido
    const updateData: UpdateItemDto = {
      ...(updateItemDto ?? {}),
      imageUrl // 🔹 Agora `imageUrl` sempre tem um valor
    };

    return this.itemsRepository.update(id, updateData);
  }

  async delete(id: string): Promise<Item | null> {
    const item = await this.itemsRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado.`);
    }

    // Remove a imagem do Supabase antes de deletar o item
    await this.supabaseService.deleteImage(item.imageUrl);

    return this.itemsRepository.delete(id);
  }
}
