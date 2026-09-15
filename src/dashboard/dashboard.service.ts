import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IDashboardStats } from '../common/interfaces/dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<IDashboardStats> {
    const [totalUsers, totalProducts, totalClients] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.client.count(),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalClients,
    };
  }
}

