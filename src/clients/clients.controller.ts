import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes empresa' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida.' })
  async findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo cliente empresa' })
  @ApiResponse({ status: 201, description: 'Cliente registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 409, description: 'RUT de empresa ya registrado.' })
  async create(@Body() createClientDto: CreateClientDto) {
    await this.clientsService.create(createClientDto);
    return { message: 'Cliente registrado exitosamente' };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar datos de cliente empresa por ID' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    await this.clientsService.update(id, updateClientDto);
    return { message: 'Cliente actualizado exitosamente' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.remove(id);
    return { message: 'Cliente eliminado exitosamente' };
  }
}

