import prisma from './db.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding administrative user...');
  
  const adminPassword = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  await prisma.user.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@portfolio.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Seeding templates...');

  const templates = [
    {
      id: 'modern-dark',
      name: 'Modern Dark',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500',
      htmlStructure: 'modern',
      cssVariables: { primary: '#10b981', darkMode: true },
      isActive: true,
      isPremium: false
    },
    {
      id: 'creative-light',
      name: 'Creative Light',
      thumbnail: 'https://images.unsplash.com/photo-1454165833767-0275cc9b96d6?q=80&w=500',
      htmlStructure: 'creative',
      cssVariables: { primary: '#ec4899', darkMode: false },
      isActive: true,
      isPremium: false
    },
    {
      id: 'corporate-clean',
      name: 'Corporate Clean',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500',
      htmlStructure: 'corporate',
      cssVariables: { primary: '#1d4ed8', darkMode: false },
      isActive: true,
      isPremium: false
    },
    {
      id: 'sidebar-minimal',
      name: 'Sidebar Minimal',
      thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=500',
      htmlStructure: 'sidebar',
      cssVariables: { primary: '#111827', darkMode: true },
      isActive: true,
      isPremium: true
    }
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: t,
      create: t
    });
  }

  console.log('Seeding complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
