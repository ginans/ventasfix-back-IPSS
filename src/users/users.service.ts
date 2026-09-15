import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from '../common/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<IUser[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        rut: true,
        nombre: true,
        apellido: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<IUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        rut: true,
        nombre: true,
        apellido: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no fue encontrado.`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException(
        `El correo electrónico ${createUserDto.email} ya está registrado.`,
      );
    }

    const existingRut = await this.prisma.user.findUnique({
      where: { rut: createUserDto.rut },
    });
    if (existingRut) {
      throw new ConflictException(
        `El RUT ${createUserDto.rut} ya se encuentra registrado.`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.findOne(id); // Valida que exista

    if (updateUserDto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException(
          `El correo ${updateUserDto.email} ya está en uso por otro usuario.`,
        );
      }
    }

    if (updateUserDto.rut) {
      const existingRut = await this.prisma.user.findUnique({
        where: { rut: updateUserDto.rut },
      });
      if (existingRut && existingRut.id !== id) {
        throw new ConflictException(
          `El RUT ${updateUserDto.rut} ya está en uso por otro usuario.`,
        );
      }
    }

    const dataToUpdate: any = { ...updateUserDto };
    if (updateUserDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Valida que exista
    await this.prisma.user.delete({
      where: { id },
    });
  }
}

