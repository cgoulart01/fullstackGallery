import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as sharp from 'sharp';
import { Express } from 'multer';

@Injectable()
export class SupabaseService {
  constructor(private readonly supabase: SupabaseClient) { }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Apenas arquivos de imagem são permitidos (jpg, png, gif, webp).');
    }

    try {
      const fileExt = extname(file.originalname).toLowerCase();
      const filename = `${uuidv4()}${fileExt}`;

      const resizedImageBuffer = await sharp(file.buffer)
        .resize(500, 500, { fit: 'cover' })
        .toFormat('jpeg')
        .toBuffer();

      const { error } = await this.supabase.storage
        .from('uploads')
        .upload(filename, resizedImageBuffer, { contentType: 'image/jpeg' });

      if (error) {
        throw new InternalServerErrorException(`Erro ao fazer upload no Supabase: ${error.message}`);
      }

      const { data } = this.supabase.storage.from('uploads').getPublicUrl(filename);
      return data.publicUrl;
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao processar a imagem: ${error.message}`);
    }
  }

  async deleteImage(filename: string): Promise<void> {
    if (!filename) {
      console.warn('⚠️ Nenhum filename recebido para deletar.');
      return;
    }

    try {
      const { error } = await this.supabase.storage.from('uploads').remove([filename]);

      if (error) {
        throw new InternalServerErrorException(`Erro ao deletar a imagem no Supabase: ${error.message}`);
      }

      console.log(`✅ Imagem ${filename} deletada do Supabase`);
    } catch (error) {
      console.error(`❌ Erro ao processar a exclusão da imagem: ${error.message}`);
    }
  }
}
