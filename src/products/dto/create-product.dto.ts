import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'FIX-101', description: 'Código SKU único del producto' })
  @IsString({ message: 'El SKU debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El SKU es obligatorio' })
  sku: string;

  @ApiProperty({ example: 'Esmeril Angular 4-1/2 850W', description: 'Nombre comercial del producto' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiProperty({
    example: 'Esmeril angular de alta durabilidad para corte y desbaste.',
    description: 'Descripción breve',
  })
  @IsString({ message: 'La descripción corta debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción corta es obligatoria' })
  descripcionCorta: string;

  @ApiProperty({
    example: 'Herramienta eléctrica profesional con motor sellado contra polvo, mango antivibración y guarda ajustable sin herramientas.',
    description: 'Descripción detallada',
  })
  @IsString({ message: 'La descripción larga debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción larga es obligatoria' })
  descripcionLarga: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1504148455328-c376907d081c',
    description: 'URL de la imagen del producto',
  })
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La imagen es obligatoria' })
  imagen: string;

  @ApiProperty({ example: 50000, description: 'Precio neto sin impuestos en pesos chilenos (CLP)' })
  @Type(() => Number)
  @IsInt({ message: 'El precio neto debe ser un número entero' })
  @Min(0, { message: 'El precio neto no puede ser negativo' })
  precioNeto: number;

  @ApiPropertyOptional({
    example: 59500,
    description: 'Precio de venta con IVA 19% (si se omite, se calcula automáticamente)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El precio de venta debe ser un número entero' })
  @Min(0, { message: 'El precio de venta no puede ser negativo' })
  precioVenta?: number;

  @ApiProperty({ example: 15, description: 'Stock actual en inventario' })
  @Type(() => Number)
  @IsInt({ message: 'El stock actual debe ser un número entero' })
  @Min(0, { message: 'El stock actual no puede ser negativo' })
  stockActual: number;

  @ApiProperty({ example: 5, description: 'Stock mínimo permitido' })
  @Type(() => Number)
  @IsInt({ message: 'El stock mínimo debe ser un número entero' })
  @Min(0, { message: 'El stock mínimo no puede ser negativo' })
  stockMinimo: number;

  @ApiProperty({ example: 10, description: 'Stock bajo de advertencia' })
  @Type(() => Number)
  @IsInt({ message: 'El stock bajo debe ser un número entero' })
  @Min(0, { message: 'El stock bajo no puede ser negativo' })
  stockBajo: number;

  @ApiProperty({ example: 50, description: 'Stock máximo/alto objetivo' })
  @Type(() => Number)
  @IsInt({ message: 'El stock alto debe ser un número entero' })
  @Min(0, { message: 'El stock alto no puede ser negativo' })
  stockAlto: number;
}

