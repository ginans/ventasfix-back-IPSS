import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: PrismaService;

  const mockClient = {
    id: 1,
    rutEmpresa: '76.123.456-7',
    rubro: 'Construcción',
    razonSocial: 'Constructora Test',
    telefono: '+56912345678',
    direccion: 'Av. Test 123',
    nombreContacto: 'Juan Contacto',
    emailContacto: 'contacto@test.cl',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: {
            client: {
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

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debe retornar lista de clientes', async () => {
    (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClient]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].rutEmpresa).toBe('76.123.456-7');
  });

  it('debe lanzar ConflictException si el RUT empresa ya existe', async () => {
    (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);

    await expect(
      service.create({
        rutEmpresa: '76.123.456-7',
        rubro: 'Otro',
        razonSocial: 'Otra',
        telefono: '+56900000000',
        direccion: 'Calle 1',
        nombreContacto: 'Pedro',
        emailContacto: 'pedro@test.cl',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('debe lanzar NotFoundException al buscar por ID inexistente', async () => {
    (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});

