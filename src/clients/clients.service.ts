import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { IClient } from '../common/interfaces/client.interface';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<IClient[]> {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<IClient> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }

    return client;
  }

  async create(createClientDto: CreateClientDto): Promise<void> {
    const existing = await this.prisma.client.findUnique({
      where: { rutEmpresa: createClientDto.rutEmpresa },
    });
    if (existing) {
      throw new ConflictException(
        `La empresa con RUT ${createClientDto.rutEmpresa} ya se encuentra registrada.`,
      );
    }

    await this.prisma.client.create({
      data: createClientDto,
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<void> {
    const existing = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }

    if (
      updateClientDto.rutEmpresa &&
      updateClientDto.rutEmpresa !== existing.rutEmpresa
    ) {
      const rutCheck = await this.prisma.client.findUnique({
        where: { rutEmpresa: updateClientDto.rutEmpresa },
      });
      if (rutCheck) {
        throw new ConflictException(
          `La empresa con RUT ${updateClientDto.rutEmpresa} ya se encuentra registrada.`,
        );
      }
    }

    await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: number): Promise<void> {
    const existing = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }

    await this.prisma.client.delete({
      where: { id },
    });
  }
}

