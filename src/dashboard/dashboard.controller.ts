import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obtener métricas y contadores totales para el Dashboard' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas con éxito.' })
  async getStats() {
    return this.dashboardService.getStats();
  }
}

