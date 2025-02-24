import {
  Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, BadRequestException, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { ItemsService } from '../services/items.service';
import { Item } from '../../models/schemas/item.schema';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'multer';

import { UpdateItemDto } from '../../dto/update-item.dto';
import { CreateItemDto } from '../../dto/create-item.dto';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Get()
  @ApiOperation({ summary: 'Retorna toda lista de Imagens' })
  @ApiResponse({ status: 200, description: 'Retorna toda a lista de imagens' })
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um item pelo ID' })
  @ApiResponse({ status: 200, description: 'Retorna um item específico' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiParam({ name: 'id', description: 'ID da imagem' })
  async findOne(@Param('id') id: string): Promise<Item> {
    const item = await this.itemsService.findOne(id);
    if (!item) throw new NotFoundException(`Item com ID ${id} não encontrado.`);
    return item;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Cria uma nova imagem' })
  @ApiResponse({
    status: 201,
    description: 'Imagem criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        imageUrl: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Erro ao criar a imagem' })
  @ApiBody({ description: 'Dados do item', type: CreateItemDto })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createItemDto: CreateItemDto
  ): Promise<Item> {
    if (!file) throw new BadRequestException('Nenhum arquivo foi enviado.');
    return this.itemsService.create(createItemDto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Atualiza uma imagem pelo ID' })
  @ApiResponse({ status: 200, description: 'Imagem atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiBody({ description: 'Dados para atualizar', type: UpdateItemDto })
  async update(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() updateImageDto?: UpdateItemDto
  ): Promise<Item> {
    return this.itemsService.update(id, { ...(updateImageDto ?? {}) }, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um item pelo ID' })
  @ApiResponse({ status: 200, description: 'Item deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async delete(@Param('id') id: string): Promise<Item | null> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Validação adequada de ObjectId do MongoDB
      throw new BadRequestException('ID inválido.');
    }
    return this.itemsService.delete(id);
  }
}
