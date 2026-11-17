import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// POST /api/admin/auth/login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Valid email and password required.' });
      return;
    }

    const { email, password } = parse.data;
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'liftandreach_super_secure_jwt_secret_key_2026_xyz!';
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      secret,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
};

// POST /api/admin/auth/logout
export const adminLogout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
};

// GET /api/admin/auth/me
export const getAdminProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  res.json({ user: req.user });
};

// ---------------- ENQUIRIES ---------------- //

// GET /api/admin/enquiries
export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const where: any = {};
    if (status && ['NEW', 'CONTACTED', 'CLOSED'].includes(String(status))) {
      where.status = String(status);
    }
    if (search) {
      const q = String(search);
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { subject: { contains: q } }
      ];
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, code: true, slug: true } },
        items: { include: { product: { select: { id: true, name: true, code: true } } } }
      }
    });

    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
};

// PUT /api/admin/enquiries/:id/status
export const updateEnquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { status } = req.body;
    if (!['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enquiry status.' });
  }
};

// DELETE /api/admin/enquiries/:id
export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.enquiry.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
};

// GET /api/admin/enquiries/export.csv
export const exportEnquiriesCsv = async (req: Request, res: Response) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true }
    });

    const header = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Subject', 'Product', 'Status', 'Message'];
    const rows = enquiries.map((e) => [
      e.id,
      e.createdAt.toISOString(),
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.email.replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${e.subject.replace(/"/g, '""')}"`,
      `"${(e.product?.name || '').replace(/"/g, '""')}"`,
      e.status,
      `"${e.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="liftandreach-enquiries-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'CSV export failed.' });
  }
};

// ---------------- PRODUCTS CRUD ---------------- //

// GET /api/admin/products
export const adminGetProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true, parent: { select: { name: true } } }
        }
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load products.' });
  }
};

// POST /api/admin/products
export const adminCreateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = await prisma.product.create({
      data: {
        categoryId: parseInt(data.categoryId, 10),
        code: data.code,
        name: data.name,
        slug,
        shortDesc: data.shortDesc,
        description: data.description,
        applications: data.applications || [],
        industries: data.industries || [],
        applicationAreas: data.applicationAreas || [],
        specTables: data.specTables || [],
        notes: data.notes || [],
        images: data.images || [],
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        sortOrder: data.sortOrder ? parseInt(data.sortOrder, 10) : 0
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product.' });
  }
};

// PUT /api/admin/products/:id
export const adminUpdateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        categoryId: data.categoryId ? parseInt(data.categoryId, 10) : undefined,
        code: data.code,
        name: data.name,
        slug: data.slug,
        shortDesc: data.shortDesc,
        description: data.description,
        applications: data.applications,
        industries: data.industries,
        applicationAreas: data.applicationAreas,
        specTables: data.specTables,
        notes: data.notes,
        images: data.images,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
        sortOrder: data.sortOrder !== undefined ? parseInt(data.sortOrder, 10) : undefined
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

// DELETE /api/admin/products/:id
export const adminDeleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

// ---------------- CATEGORIES CRUD ---------------- //

export const adminGetCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true, children: true } }
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

export const adminCreateCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const cat = await prisma.category.create({
      data: {
        parentId: data.parentId ? parseInt(data.parentId, 10) : null,
        name: data.name,
        slug,
        image: data.image,
        description: data.description,
        applications: data.applications || [],
        industries: data.industries || [],
        applicationAreas: data.applicationAreas || [],
        sortOrder: data.sortOrder ? parseInt(data.sortOrder, 10) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true
      }
    });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category.' });
  }
};

export const adminUpdateCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = req.body;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        parentId: data.parentId !== undefined ? (data.parentId ? parseInt(data.parentId, 10) : null) : undefined,
        name: data.name,
        slug: data.slug,
        image: data.image,
        description: data.description,
        applications: data.applications,
        industries: data.industries,
        applicationAreas: data.applicationAreas,
        sortOrder: data.sortOrder !== undefined ? parseInt(data.sortOrder, 10) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category.' });
  }
};

export const adminDeleteCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};

// ---------------- HERO SLIDES CRUD ---------------- //

export const adminGetHeroSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hero slides.' });
  }
};

export const adminCreateHeroSlide = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const slide = await prisma.heroSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        badge: data.badge,
        image: data.image,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        ctaText2: data.ctaText2,
        ctaLink2: data.ctaLink2,
        sortOrder: data.sortOrder ? parseInt(data.sortOrder, 10) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true
      }
    });
    res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create slide.' });
  }
};

export const adminUpdateHeroSlide = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = req.body;
    const slide = await prisma.heroSlide.update({
      where: { id },
      data
    });
    res.json(slide);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update slide.' });
  }
};

export const adminDeleteHeroSlide = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.heroSlide.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete slide.' });
  }
};

// ---------------- SETTINGS & PAGE CONTENT ---------------- //

export const adminUpdateSettings = async (req: Request, res: Response) => {
  try {
    const settings = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }
    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings.' });
  }
};

export const adminUpdatePage = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const { title, content } = req.body;
    const updated = await prisma.page.upsert({
      where: { slug },
      update: { title, content },
      create: { slug, title, content }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update page.' });
  }
};
