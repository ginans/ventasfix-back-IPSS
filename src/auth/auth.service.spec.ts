import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    rut: '11.111.111-1',
    nombre: 'Admin',
    apellido: 'Test',
    email: 'admin@ventasfix.cl',
    password: '',
  };

  beforeEach(async () => {
    mockUser.password = await bcrypt.hash('Password123!', 10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debe autenticar con credenciales válidas y devolver token', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.login({
      email: 'admin@ventasfix.cl',
      password: 'Password123!',
    });

    expect(result.token).toBe('mocked-jwt-token');
    expect(result.user.email).toBe('admin@ventasfix.cl');
    expect(jwtService.sign).toHaveBeenCalled();
  });

  it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.login({
        email: 'inexistente@ventasfix.cl',
        password: 'Password123!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('debe lanzar UnauthorizedException si la contraseña no coincide', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      service.login({
        email: 'admin@ventasfix.cl',
        password: 'ClaveEquivocada!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

