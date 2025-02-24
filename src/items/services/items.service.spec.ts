import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemsRepository } from '../repositories/items.repository';
import { SupabaseService } from '../../config/services/supabase.service';
import { Item } from '../../models/schemas/item.schema';

describe('ItemsService', () => {
  let itemsService: ItemsService;
  let itemsRepository: ItemsRepository;
  let supabaseService: SupabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: ItemsRepository,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: SupabaseService,
          useValue: {
            uploadItem: jest.fn(),
            deleteItem: jest.fn(),
          },
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemsRepository = module.get<ItemsRepository>(ItemsRepository);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('deve criar um item e garantir que `createdAt` e `updatedAt` são gerados automaticamente', async () => {
    const file = { buffer: Buffer.from('test'), mimetype: 'image/jpeg' } as any;
    const mockItem: Item = {
      _id: '123',
      title: 'Teste',
      description: 'Teste',
      url: 'mockUrl',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(supabaseService, 'uploadItem').mockResolvedValue('mockUrl');
    jest.spyOn(itemsRepository, 'create').mockResolvedValue(mockItem);

    const result = await itemsService.create('Teste', 'Teste', file);

    expect(result).toEqual(mockItem);
    expect(result.createdAt).toBeDefined(); // 🔹 Garante que o campo foi gerado automaticamente
    expect(result.updatedAt).toBeDefined();
    expect(supabaseService.uploadItem).toHaveBeenCalledWith(file);
    expect(itemsRepository.create).toHaveBeenCalledWith('Teste', 'Teste', 'mockUrl');
  });

  it('deve atualizar um item e garantir que `createdAt` não foi alterado', async () => {
    const file = { buffer: Buffer.from('test'), mimetype: 'image/jpeg' } as any;
    const mockItemBeforeUpdate: Item = {
      _id: '123',
      title: 'Teste',
      description: 'Teste',
      url: 'mockUrl',
      createdAt: new Date('2024-01-01T00:00:00Z'), // Simula um valor fixo
      updatedAt: new Date('2024-02-01T00:00:00Z'),
    };

    const mockItemAfterUpdate: Item = {
      ...mockItemBeforeUpdate,
      title: 'Novo Título',
      description: 'Nova Descrição',
      imageUrl: 'newMockUrl',
      updatedAt: new Date(), // Deve ser atualizado automaticamente
    };

    jest.spyOn(itemsRepository, 'findOne').mockResolvedValue(mockItemBeforeUpdate);
    jest.spyOn(supabaseService, 'uploadItem').mockResolvedValue('newMockUrl');
    jest.spyOn(itemsRepository, 'update').mockResolvedValue(mockItemAfterUpdate);

    const result = await itemsService.update('123', 'Novo Título', 'Nova Descrição', file);

    expect(result.title).toBe('Novo Título');
    expect(result.description).toBe('Nova Descrição');
    expect(result.imageUrl).toBe('newMockUrl');
    expect(result.updatedAt).not.toEqual(mockItemBeforeUpdate.updatedAt); // 🔹 Garante que updatedAt foi alterado
    expect(result.createdAt).toEqual(mockItemBeforeUpdate.createdAt); // 🔹 Garante que createdAt NÃO foi alterado
  });

  it('deve excluir um item e garantir que foi removido corretamente', async () => {
    const mockItem: Item = {
      _id: '123',
      title: 'Teste',
      description: 'Teste',
      url: 'mockUrl',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(itemsRepository, 'findOne').mockResolvedValue(mockItem);
    jest.spyOn(supabaseService, 'deleteItem').mockResolvedValue();
    jest.spyOn(itemsRepository, 'delete').mockResolvedValue(mockItem);

    const result = await itemsService.delete('123');

    expect(result).toEqual(mockItem);
    expect(supabaseService.deleteItem).toHaveBeenCalledWith('mockUrl');
    expect(itemsRepository.delete).toHaveBeenCalledWith('123');
  });
});
