import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsRut } from '../../common/validators/is-rut.validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: '11.111.111-1',
    description: 'RUT chileno del usuario administrador',
  })
  @IsOptional()
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @IsRut({ message: 'El RUT ingresado no es válido (verifique dígito verificador)' })
  rut?: string;

  @ApiPropertyOptional({ example: 'Juan', description: 'Nombre del usuario' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @ApiPropertyOptional({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  apellido?: string;

  @ApiPropertyOptional({
    example: 'jperez@ventasfix.cl',
    description: 'Correo corporativo (debe terminar en @ventasfix.cl)',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@ventasfix\.cl$/, {
    message: 'El correo electrónico institucional debe pertenecer al dominio @ventasfix.cl',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'NuevaClave2026!',
    description: 'Nueva contraseña (opcional)',
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    example: 'ADMIN',
    description: 'Rol del usuario (ADMIN o VIEWER)',
    enum: ['ADMIN', 'VIEWER'],
  })
  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  role?: string;
}

