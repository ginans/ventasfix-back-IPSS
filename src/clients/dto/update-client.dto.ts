import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsRut } from '../../common/validators/is-rut.validator';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: '76.123.456-7' })
  @IsOptional()
  @IsString({ message: 'El RUT de empresa debe ser una cadena de texto' })
  @IsRut({ message: 'El RUT de la empresa no es válido' })
  rutEmpresa?: string;

  @ApiPropertyOptional({ example: 'Construcción e Ingeniería' })
  @IsOptional()
  @IsString({ message: 'El rubro debe ser una cadena de texto' })
  rubro?: string;

  @ApiPropertyOptional({ example: 'Constructora Los Andes SpA' })
  @IsOptional()
  @IsString({ message: 'La razón social debe ser una cadena de texto' })
  razonSocial?: string;

  @ApiPropertyOptional({ example: '+56 9 8765 4321' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  @ApiPropertyOptional({ example: 'Av. Providencia 1234, Of. 501, Santiago' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  direccion?: string;

  @ApiPropertyOptional({ example: 'Carlos Mendoza' })
  @IsOptional()
  @IsString({ message: 'El nombre de contacto debe ser una cadena de texto' })
  nombreContacto?: string;

  @ApiPropertyOptional({ example: 'cmendoza@losandes.cl' })
  @IsOptional()
  @IsEmail({}, { message: 'El correo de contacto debe ser válido' })
  emailContacto?: string;
}

