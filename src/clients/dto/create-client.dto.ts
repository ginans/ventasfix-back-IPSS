import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsRut } from '../../common/validators/is-rut.validator';

export class CreateClientDto {
  @ApiProperty({
    example: '76.123.456-7',
    description: 'RUT chileno de la empresa cliente',
  })
  @IsString({ message: 'El RUT de empresa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El RUT de empresa es obligatorio' })
  @IsRut({ message: 'El RUT de la empresa no es válido' })
  rutEmpresa: string;

  @ApiProperty({ example: 'Construcción e Ingeniería', description: 'Giro o rubro comercial' })
  @IsString({ message: 'El rubro debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El rubro es obligatorio' })
  rubro: string;

  @ApiProperty({ example: 'Constructora Los Andes SpA', description: 'Razón social' })
  @IsString({ message: 'La razón social debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La razón social es obligatoria' })
  razonSocial: string;

  @ApiProperty({ example: '+56 9 8765 4321', description: 'Teléfono de contacto' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono: string;

  @ApiProperty({ example: 'Av. Providencia 1234, Of. 501, Santiago', description: 'Dirección física' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion: string;

  @ApiProperty({ example: 'Carlos Mendoza', description: 'Nombre de la persona de contacto' })
  @IsString({ message: 'El nombre de contacto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de contacto es obligatorio' })
  nombreContacto: string;

  @ApiProperty({ example: 'cmendoza@losandes.cl', description: 'Correo electrónico de contacto' })
  @IsEmail({}, { message: 'El correo de contacto debe ser válido' })
  @IsNotEmpty({ message: 'El correo de contacto es obligatorio' })
  emailContacto: string;
}

