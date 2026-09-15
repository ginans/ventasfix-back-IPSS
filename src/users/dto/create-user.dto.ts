import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsRut } from '../../common/validators/is-rut.validator';

export class CreateUserDto {
  @ApiProperty({
    example: '11.111.111-1',
    description: 'RUT chileno del usuario administrador',
  })
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El RUT es obligatorio' })
  @IsRut({ message: 'El RUT ingresado no es válido (verifique dígito verificador)' })
  rut: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string;

  @ApiProperty({
    example: 'jperez@ventasfix.cl',
    description: 'Correo corporativo (debe terminar en @ventasfix.cl)',
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @Matches(/^[a-zA-Z0-9._%+-]+@ventasfix\.cl$/, {
    message: 'El correo electrónico institucional debe pertenecer al dominio @ventasfix.cl',
  })
  email: string;

  @ApiProperty({
    example: 'ClaveSegura2026!',
    description: 'Contraseña para acceder al backoffice',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

