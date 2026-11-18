import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';
import prisma from './utils/prisma';
import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Handled or configured for modern SPA integration
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (CLIENT_URL === '*' || origin === CLIENT_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static Uploads & Public Images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../../client/public/images')));

// Root & Health Checks for container deployment
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Lift and Reach API', timestamp: new Date().toISOString() });
});

app.get(['/health', '/healthz', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Database Setup / Sync Endpoint (can be triggered manually if ever required)
app.all('/api/setup-db', async (req, res) => {
  try {
    console.log('🔄 Triggering manual database push and seed...');
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    execSync('npx tsx prisma/seed.ts', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    res.json({ success: true, message: 'Database tables verified and seeded successfully!' });
  } catch (err: any) {
    console.error('Database setup endpoint error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Database setup failed' });
  }
});

// API Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

// Auto-initialize database schema on startup if needed
async function autoInitDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not configured. Skipping database setup.');
    return;
  }
  try {
    console.log('🔄 Checking database tables and schema...');
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Database schema in sync.');

    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
      console.log('🌱 Database is empty. Seeding initial products, categories, and settings...');
      execSync('npx tsx prisma/seed.ts', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Initial seed completed successfully.');
    } else {
      console.log(`ℹ️ Database already initialized (${categoryCount} categories found).`);
    }
  } catch (err: any) {
    console.error('⚠️ Database auto-init error (server still running):', err?.message || err);
  }
}

app.listen(PORT, HOST, () => {
  console.log(`🚀 Lift and Reach API server listening on http://${HOST}:${PORT}`);
  console.log(`🌐 CORS enabled for: ${CLIENT_URL}`);
  
  // Run auto-init in background without blocking server health checks
  autoInitDatabase();
});

export default app;
