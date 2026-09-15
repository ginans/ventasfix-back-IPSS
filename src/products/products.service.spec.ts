import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { EStockStatus } from '../common/enums/stock-status.enum';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockProduct = {
    id: 1,
    sku: 'SKU-001',
    nombre: 'Taladro',
    descripcionCorta: 'Taladro percutor',
    descripcionLarga: 'Taladro percutor 20V',
    imagen: 'https://example.com/img.jpg',
    precioNeto: 100000,
    precioVenta: 119000,
    stockActual: 3,
    stockMinimo: 5,
    stockBajo: 10,
    stockAlto: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debe listar productos calculando correctamente el estado de stock (CRITICAL)', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);

    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].stockStatus).toBe(EStockStatus.CRITICAL);
  });

  it('debe calcular automáticamente el precio de venta con IVA (19%) si no se provee', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.product.create as jest.Mock).mockResolvedValue({ id: 2 });

    await service.create({
      sku: 'SKU-NEW',
      nombre: 'Nuevo',
      descripcionCorta: 'Desc',
      descripcionLarga: 'Desc Larga',
      imagen: 'https://example.com/img.jpg',
      precioNeto: 100000,
      stockActual: 20,
      stockMinimo: 5,
      stockBajo: 10,
      stockAlto: 30,
    });

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        precioVenta: 119000,
      }),
    });
  });

  it('debe lanzar ConflictException si el SKU ya existe al crear', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    await expect(
      service.create({
        sku: 'SKU-001',
        nombre: 'Repetido',
        descripcionCorta: 'Desc',
        descripcionLarga: 'Desc Larga',
        imagen: 'https://example.com/img.jpg',
        precioNeto: 50000,
        stockActual: 10,
        stockMinimo: 2,
        stockBajo: 5,
        stockAlto: 20,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('debe lanzar NotFoundException si el producto no existe al buscar por ID', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});

