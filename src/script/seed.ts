import { PrismaClient, Status, Placement } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@malokunlabs.com' },
    update: {},
    create: {
      email: 'admin@malokunlabs.com',
      password: adminPassword,
      name: 'Super Admin',
    },
  });

  
  const campaign = await prisma.campaign.upsert({
    where: { id: 'seed-campaign-id' },
    update: {},
    create: {
      id: 'seed-campaign-id',
      name: 'Launch Campaign',
      status: Status.ACTIVE,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      adminId: admin.id,
    },
  });

  
  await prisma.ad.upsert({
    where: { id: 'seed-ad-id' },
    update: {},
    create: {
      id: 'seed-ad-id',
      title: 'Welcome Banner',
      ctaLink: 'https:
      placement: Placement.HOMEPAGE_BANNER,
      status: Status.ACTIVE,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      campaignId: campaign.id,
      imageUrl: 'https:
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
