import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as sharp from 'sharp';
import { Express } from "Multer"
@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;
    const supabaseBucket = process.env.SUPABASE_BUCKET;

    console.log('🔍 Supabase Config:', { supabaseUrl, supabaseBucket });

    if (!supabaseUrl || !supabaseKey || !supabaseBucket) {
      throw new Error('SUPABASE_URL, SUPABASE_SECRET_KEY e SUPABASE_BUCKET são obrigatórios!');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  getClient(): SupabaseClient {
    return this.supabase;
  }


  async uploadItem(file: Express.Multer.File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return reject(new BadRequestException('Apenas arquivos de imagem são permitidos (jpg, png, gif, webp).'));
        }

        const fileExt = extname(file.originalname).toLowerCase();
        const filename = `${uuidv4()}${fileExt}`;

        const resizedImageBuffer = await sharp(file.buffer)
          .resize(500, 500, { fit: 'cover' })
          .toFormat('jpeg')
          .toBuffer();

        const { data, error } = await this.supabase
          .storage
          .from(process.env.SUPABASE_BUCKET as string)
          .upload(filename, resizedImageBuffer, { contentType: 'image/jpeg' });

        if (error) {
          return reject(new InternalServerErrorException(`Erro ao fazer upload no Supabase: ${error.message}`));
        }

        const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${filename}`;

        resolve(imageUrl);
      } catch (error) {
        reject(new InternalServerErrorException(`Erro ao processar a imagem: ${error.message}`));
      }
    });
  }

  async deleteItem(filename: string | undefined): Promise<void> {
    if (!filename) {
      console.warn('⚠️ Nenhum filename recebido para deletar.');
      return;
    }

    try {
      const { error } = await this.supabase
        .storage
        .from(process.env.SUPABASE_BUCKET as string)
        .remove([filename]);

      if (error) {
        throw new Error(`Erro ao deletar a imagem no Supabase: ${error.message}`);
      }

      console.log(`✅ Imagem ${filename} deletada do Supabase`);
    } catch (error) {
      console.error(`❌ Erro ao processar a exclusão da imagem: ${error.message}`);
    }
  }
}
