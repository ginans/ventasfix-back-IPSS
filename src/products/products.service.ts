import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProduct } from '../common/interfaces/product.interface';
import { EStockStatus } from '../common/enums/stock-status.enum';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateStockStatus(
    actual: number,
    minimo: number,
    bajo: number,
    alto: number,
  ): EStockStatus {
    if (actual <= minimo) return EStockStatus.CRITICAL;
    if (actual <= bajo) return EStockStatus.LOW;
    if (actual <= alto) return EStockStatus.NORMAL;
    return EStockStatus.HIGH;
  }

  async findAll(): Promise<IProduct[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
      ...p,
      stockStatus: this.calculateStockStatus(
        p.stockActual,
        p.stockMinimo,
        p.stockBajo,
        p.stockAlto,
      ),
    }));
  }

  async findOne(id: number): Promise<IProduct> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    return {
      ...product,
      stockStatus: this.calculateStockStatus(
        product.stockActual,
        product.stockMinimo,
        product.stockBajo,
        product.stockAlto,
      ),
    };
  }

  async create(createProductDto: CreateProductDto): Promise<void> {
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });
    if (existingSku) {
      throw new ConflictException(
        `El SKU ${createProductDto.sku} ya se encuentra registrado.`,
      );
    }

    // Cálculo de IVA (19%) si no se entrega precio de venta o para garantizar consistencia
    const precioVenta =
      createProductDto.precioVenta ??
      Math.round(createProductDto.precioNeto * 1.19);

    await this.prisma.product.create({
      data: {
        ...createProductDto,
        precioVenta,
      },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const skuCheck = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });
      if (skuCheck) {
        throw new ConflictException(
          `El SKU ${updateProductDto.sku} ya se encuentra registrado.`,
        );
      }
    }

    const dataToUpdate: any = { ...updateProductDto };

    // Si se actualizó precio neto y no se especificó precio de venta, recalcular con IVA 19%
    if (
      updateProductDto.precioNeto !== undefined &&
      updateProductDto.precioVenta === undefined
    ) {
      dataToUpdate.precioVenta = Math.round(updateProductDto.precioNeto * 1.19);
    }

    await this.prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number): Promise<void> {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    await this.prisma.product.delete({
      where: { id },
    });
  }
}

