import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Status } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(createCampaignDto: CreateCampaignDto, adminId: string) {
    const campaign = await this.prisma.campaign.create({
      data: {
        ...createCampaignDto,
        adminId,
      },
      include: {
        ads: true,
      },
    });

    await this.logActivity('CREATE', 'campaign', campaign.id, adminId, {
      name: campaign.name,
    });

    return campaign;
  }

  async findAll() {
    return this.prisma.campaign.findMany({
      include: {
        ads: {
          select: {
            id: true,
            title: true,
            status: true,
            placement: true,
          },
        },
        _count: {
          select: {
            ads: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        ads: {
          include: {
            analytics: {
              select: {
                impressions: true,
                clicks: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async update(
    id: string,
    updateCampaignDto: UpdateCampaignDto,
    adminId: string,
  ) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
      include: {
        ads: true,
      },
    });

    await this.logActivity(
      'UPDATE',
      'campaign',
      id,
      adminId,
      updateCampaignDto,
    );

    return updated;
  }

  async remove(id: string, adminId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    await this.prisma.campaign.delete({ where: { id } });

    await this.logActivity('DELETE', 'campaign', id, adminId, {
      name: campaign.name,
    });

    return { message: 'Campaign deleted successfully' };
  }

  async updateStatus(id: string, status: Status, adminId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: { status },
    });

    await this.logActivity('UPDATE_STATUS', 'campaign', id, adminId, {
      status,
    });

    return updated;
  }

  async assignAds(id: string, adIds: string[], adminId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    await this.prisma.ad.updateMany({
      where: {
        id: {
          in: adIds,
        },
      },
      data: {
        campaignId: id,
      },
    });

    await this.logActivity('ASSIGN_ADS', 'campaign', id, adminId, { adIds });

    return this.findOne(id);
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
