import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Status } from '@prisma/client';

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  async create(createAdDto: CreateAdDto, adminId: string) {
    const ad = await this.prisma.ad.create({
      data: {
        ...createAdDto,
        adminId,
      },
      include: {
        campaign: true,
      },
    });

    await this.logActivity('CREATE', 'ad', ad.id, adminId, { title: ad.title });

    return ad;
  }

  async findAll(adminId?: string) {
    return this.prisma.ad.findMany({
      where: adminId ? { adminId } : {},
      include: {
        campaign: true,
        analytics: {
          select: {
            impressions: true,
            clicks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: {
        campaign: true,
        analytics: {
          select: {
            impressions: true,
            clicks: true,
            date: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return ad;
  }

  async update(id: string, updateAdDto: UpdateAdDto, adminId: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id } });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    const updated = await this.prisma.ad.update({
      where: { id },
      data: updateAdDto,
      include: {
        campaign: true,
      },
    });

    await this.logActivity('UPDATE', 'ad', id, adminId, updateAdDto);

    return updated;
  }

  async remove(id: string, adminId: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id } });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    await this.prisma.ad.delete({ where: { id } });

    await this.logActivity('DELETE', 'ad', id, adminId, { title: ad.title });

    return { message: 'Ad deleted successfully' };
  }

  async updateStatus(id: string, status: Status, adminId: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id } });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    const updated = await this.prisma.ad.update({
      where: { id },
      data: { status },
    });

    await this.logActivity('UPDATE_STATUS', 'ad', id, adminId, { status });

    return updated;
  }

  private async logActivity(
    action: string,
    entity: string,
    entityId: string,
    userId: string,
    metadata?: any,
  ) {
    await this.prisma.activityLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        metadata,
      },
    });
  }
}
