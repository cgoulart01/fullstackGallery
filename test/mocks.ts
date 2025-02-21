import { Image } from '../src/images/schemas/item.schema';
import { Express } from 'multer';
export const mockFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'imagem-teste.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('fake-image-data'),
  size: 1024,
  destination: '',
  filename: '',
  path: '',
  stream: null,
};

export const mockImage = {
  _id: '123',
  name: 'Minha Imagem',
  url: 'https://supabase.com/storage/v1/object/public/uploads/123.jpg',
};
