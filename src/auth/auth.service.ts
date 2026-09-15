import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ILoginResponse, IJwtPayload } from '../common/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos');
    }

    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      rut: user.rut,
      nombre: user.nombre,
      apellido: user.apellido,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        rut: user.rut,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
    };
  }
}

