import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- PRISMA SEEDING START ---');
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }

  // Create default template
  const templateId = 'default-template';
  const existingTemplate = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!existingTemplate) {
    await prisma.template.create({
      data: {
        id: templateId,
        name: 'Professional Template',
        thumbnail: 'https://via.placeholder.com/300x200',
        htmlStructure: 'standard',
        cssVariables: {},
        isActive: true,
      },
    });
    console.log('Default template created successfully');
  } else {
    console.log('Default template already exists');
  }
  console.log('--- PRISMA SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
