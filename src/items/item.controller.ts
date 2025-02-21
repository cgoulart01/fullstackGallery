import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, BadRequestException, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './schemas/item.schema';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'Multer';
import { title } from 'process';
import { url } from 'inspector';
@ApiTags('Items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

  @Get()
  @ApiOperation({ summary: 'Retorna toda lista de Imagens' })
  @ApiResponse({ status: 200, description: 'Retorna toda a lista de imagens' })
  async findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um dos itens da lista pelo ID' })
  @ApiResponse({ status: 200, description: 'Retorna um item específico' })
  @ApiResponse({ status: 404, description: 'Retorna quando não encontra nenhum item' })
  @ApiParam({ name: 'Id da Imagem', description: 'ID da imagem' })
  async findOne(@Param('id') id: string): Promise<Item> {
    const image = await this.itemService.findOne(id);
    if (!image) throw new NotFoundException(`Image with id ${id} not found`);
    return image;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Cria uma nova imagem' })
  @ApiResponse({ status: 201, description: 'Imagem criada com sucesso', schema: { type: 'object', properties: { _id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, url: { type: 'string' } } } })
  @ApiResponse({ status: 400, description: 'Erro ao criar a imagem', schema: { type: 'object', properties: { message: { type: 'string' } } } })
  @ApiBody({ description: 'Nome da imagem', type: String })
  @ApiBody({ description: 'Arquivo da imagem', type: 'multipart/form-data' })
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: { title: string, description: string }): Promise<Item> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    return this.itemService.create(body.title, body.description, file);
  }




  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Atualiza uma imagem pelo ID' })
  @ApiResponse({ status: 200, description: 'Imagem atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  @ApiParam({ name: 'Id da Imagem', description: 'ID da imagem' })
  @ApiBody({ description: 'Nome da imagem', type: String })
  @ApiBody({ description: 'Arquivo da imagem', type: 'multipart/form-data' })
  async update(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: { name?: string },
  ): Promise<Item> {
    const name = body?.name || undefined;
    return this.itemService.update(id, name, file);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma imagem pelo ID' })
  @ApiResponse({ status: 200, description: 'Imagem deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async delete(@Param('id') id: string): Promise<Item> {
    return this.itemService.delete(id);
  }
}
