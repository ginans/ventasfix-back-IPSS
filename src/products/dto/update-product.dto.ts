import {
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'FIX-101', description: 'Código SKU único del producto' })
  @IsOptional()
  @IsString({ message: 'El SKU debe ser una cadena de texto' })
  sku?: string;

  @ApiPropertyOptional({ example: 'Esmeril Angular 4-1/2 850W' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @ApiPropertyOptional({ example: 'Descripción corta actualizada' })
  @IsOptional()
  @IsString({ message: 'La descripción corta debe ser una cadena de texto' })
  descripcionCorta?: string;

  @ApiPropertyOptional({ example: 'Descripción detallada actualizada' })
  @IsOptional()
  @IsString({ message: 'La descripción larga debe ser una cadena de texto' })
  descripcionLarga?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1504148455328-c376907d081c' })
  @IsOptional()
  @IsString({ message: 'La imagen debe ser una cadena de texto' })
  imagen?: string;

  @ApiPropertyOptional({ example: 55000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El precio neto debe ser un número entero' })
  @Min(0, { message: 'El precio neto no puede ser negativo' })
  precioNeto?: number;

  @ApiPropertyOptional({ example: 65450 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El precio de venta debe ser un número entero' })
  @Min(0, { message: 'El precio de venta no puede ser negativo' })
  precioVenta?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El stock actual debe ser un número entero' })
  @Min(0, { message: 'El stock actual no puede ser negativo' })
  stockActual?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El stock mínimo debe ser un número entero' })
  @Min(0, { message: 'El stock mínimo no puede ser negativo' })
  stockMinimo?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El stock bajo debe ser un número entero' })
  @Min(0, { message: 'El stock bajo no puede ser negativo' })
  stockBajo?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El stock alto debe ser un número entero' })
  @Min(0, { message: 'El stock alto no puede ser negativo' })
  stockAlto?: number;
}

