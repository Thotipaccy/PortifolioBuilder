import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import projectRoutes from './routes/project.routes.js';
import templateRoutes from './routes/template.routes.js';
import experienceRoutes from './routes/experience.routes.js';
import educationRoutes from './routes/education.routes.js';
import adminRoutes from './routes/admin.routes.js';
import skillRoutes from './routes/skill.routes.js';
import bcrypt from 'bcryptjs';
import prisma from './db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('--- BACKEND STARTUP ---');
console.log(`Port: ${PORT}`);
console.log(`Database URL: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@') : 'NOT SET'}`);
console.log('-----------------------');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Static files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/skills', skillRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// DEBUG ENDPOINTS (Temporary)
app.get('/api/debug/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users.map(u => ({ email: u.email, role: u.role, name: u.name })));
});
app.get('/api/debug/templates', async (req, res) => {
  const templates = await prisma.template.findMany();
  res.json(templates);
});

// Global Error Handler
app.use((err, req, res, next) => {
  // LOG the full error for debugging
  console.error('--- SERVER ERROR ---');
  console.error(err.stack || err);
  console.error('--------------------');

  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File is too large! Maximum limit is 10MB.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Seed function
const seedDatabase = async () => {
  try {
    console.log('--- AUTO-SEEDING START ---');
    
    // Create Default Template
    const templateId = 'default-template';
    const existingTemplate = await prisma.template.findUnique({ where: { id: templateId } });
    if (!existingTemplate) {
      await prisma.template.create({
        data: {
          id: templateId,
          name: 'Professional Template',
          thumbnail: '/placeholder.png',
          htmlStructure: 'standard',
          cssVariables: {},
          isActive: true,
        }
      });
      console.log('✅ Default template created');
    }

    // Create Admin User
    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await prisma.user.create({
        data: {
          name: 'NIBISHAKA Thoti Pacifique',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          title: 'Software Engineering Student | Passionate Developer | Future Tech Leader',
          bio: 'I am a highly motivated Software Engineering student with a passion for building innovative solutions and leading tech initiatives.',
          location: 'Rwanda',
        }
      });
      console.log('✅ Admin account created (admin@example.com / admin123)');
    }
    
    console.log('--- AUTO-SEEDING COMPLETE ---');
  } catch (error) {
    console.error('❌ SEEDING ERROR:', error);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await seedDatabase();
});
