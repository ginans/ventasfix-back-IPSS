import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockUser = {
    id: 1,
    rut: '11.111.111-1',
    nombre: 'Admin',
    apellido: 'Test',
    email: 'admin@ventasfix.cl',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
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

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debe retornar lista de usuarios sin passwords', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        rut: '11.111.111-1',
        nombre: 'Admin',
        apellido: 'Test',
        email: 'admin@ventasfix.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect((result[0] as any).password).toBeUndefined();
  });

  it('debe lanzar ConflictException si el email ya existe al crear', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      service.create({
        rut: '22.222.222-2',
        nombre: 'Otro',
        apellido: 'User',
        email: 'admin@ventasfix.cl',
        password: 'Password123!',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('debe lanzar NotFoundException al buscar por ID inexistente', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});

