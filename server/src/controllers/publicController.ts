import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { verifyCaptchaToken } from '../utils/captcha';
import { sendEnquiryEmail } from '../utils/mailer';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// GET /api/categories (nested tree structure)
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            products: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                code: true,
                name: true,
                slug: true,
                shortDesc: true,
                images: true
              }
            }
          }
        },
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            code: true,
            name: true,
            slug: true,
            shortDesc: true,
            images: true
          }
        }
      }
    });

    const roots = categories.filter((c) => c.parentId === null);
    res.json(roots);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// GET /api/products?category=&sub=&q=&industry=&cap=&sort=
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, sub, q, industry, cap, sort } = req.query;

    const whereClause: any = { isActive: true };

    if (sub) {
      const subCat = await prisma.category.findUnique({
        where: { slug: String(sub) }
      });
      if (subCat) {
        whereClause.categoryId = subCat.id;
      }
    } else if (category && category !== 'all') {
      const cat = await prisma.category.findUnique({
        where: { slug: String(category) },
        include: { children: true }
      });
      if (cat) {
        const catIds = [cat.id, ...cat.children.map((c) => c.id)];
        whereClause.categoryId = { in: catIds };
      }
    }

    if (q) {
      const search = String(q);
      whereClause.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { shortDesc: { contains: search } },
        { description: { contains: search } }
      ];
    }

    // Default order: category sort order then product sort order
    let orderBy: any = [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }];
    if (sort === 'name-asc') {
      orderBy = [{ name: 'asc' }];
    } else if (sort === 'name-desc') {
      orderBy = [{ name: 'desc' }];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            sortOrder: true,
            parent: {
              select: { id: true, name: true, slug: true, sortOrder: true }
            }
          }
        }
      }
    });

    let filtered = products;

    // Filter by industry
    if (industry && industry !== 'all') {
      const indStr = String(industry).toLowerCase();
      filtered = filtered.filter((p) => {
        const indList = (p.industries as string[]) || [];
        return indList.some((item) => item.toLowerCase().includes(indStr));
      });
    }

    // Filter by capacity range (approximate parsing from specs or code)
    if (cap && cap !== 'all') {
      const capQuery = String(cap).toLowerCase();
      filtered = filtered.filter((p) => {
        const str = JSON.stringify(p.specTables || '') + ' ' + (p.code || '') + ' ' + (p.name || '');
        if (capQuery === 'under-1t') {
          return str.includes('300') || str.includes('350') || str.includes('500') || str.includes('750') || str.includes('800');
        } else if (capQuery === '1t-3t') {
          return str.includes('1 TON') || str.includes('1000') || str.includes('1.5T') || str.includes('2 TON') || str.includes('2000') || str.includes('2.5T') || str.includes('3 TON');
        } else if (capQuery === 'over-3t') {
          return str.includes('9000') || str.includes('10000') || str.includes('12000') || str.includes('10 TON') || str.includes('20T') || str.includes('25 TON');
        }
        return true;
      });
    }

    // In-memory sort for capacity if requested
    if (sort === 'cap-asc' || sort === 'cap-desc') {
      const parseCap = (p: typeof products[0]) => {
        const text = (p.code || '') + ' ' + JSON.stringify(p.specTables || '');
        const matchTon = text.match(/(\d+(?:\.\d+)?)\s*(?:TON|T\b)/i);
        if (matchTon) return parseFloat(matchTon[1]) * 1000;
        const matchKg = text.match(/(\d+)\s*Kg/i);
        if (matchKg) return parseFloat(matchKg[1]);
        return 1000;
      };

      filtered.sort((a, b) => {
        const capA = parseCap(a);
        const capB = parseCap(b);
        return sort === 'cap-asc' ? capA - capB : capB - capA;
      });
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            parent: true
          }
        }
      }
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true
      },
      take: 4,
      select: {
        id: true,
        code: true,
        name: true,
        slug: true,
        shortDesc: true,
        images: true,
        specTables: true,
        notes: true,
        category: {
          select: { slug: true, name: true }
        }
      }
    });

    res.json({
      ...product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

// GET /api/products/:slug/datasheet.pdf
export const generateDatasheetPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true }
    });

    if (!product) {
      res.status(404).send('Product not found');
      return;
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${product.slug}-datasheet.pdf"`);
    doc.pipe(res);

    // Header with Brand Blue Accent
    doc.rect(40, 40, 515, 60).fill('#1A2E4C');
    doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold').text('LIFT AND REACH EQUIPMENTS', 55, 52);
    doc.fillColor('#E53935').fontSize(9).font('Helvetica-Bold').text('A WAY TO REACH THE GOAL', 55, 75);
    doc.fillColor('#CBD5E1').fontSize(8).font('Helvetica').text('Kuthambakkam, Chennai | (+91) 89393 59592 | liftnreach@gmail.com', 55, 87);

    // Product Title & Category
    doc.moveDown(3);
    doc.fillColor('#2F5FA8').fontSize(16).font('Helvetica-Bold').text(product.name, 40, 120);
    if (product.code) {
      doc.fillColor('#64748B').fontSize(10).font('Helvetica').text(`Model Code: ${product.code}`, 40, 140);
    }
    doc.fillColor('#64748B').fontSize(10).font('Helvetica').text(`Category: ${product.category?.name}`, 40, 155);

    // Description
    doc.moveDown(1);
    doc.fillColor('#334155').fontSize(9).font('Helvetica').text(product.description || product.shortDesc || '', 40, 175, {
      width: 515,
      lineGap: 3
    });

    let currentY = doc.y + 15;

    // Spec Tables
    if (product.specTables && Array.isArray(product.specTables) && product.specTables.length > 0) {
      doc.fillColor('#1A2E4C').fontSize(12).font('Helvetica-Bold').text('TECHNICAL SPECIFICATIONS', 40, currentY);
      currentY += 18;

      for (const table of product.specTables as any[]) {
        if (table.title) {
          doc.fillColor('#2F5FA8').fontSize(9).font('Helvetica-Bold').text(table.title, 40, currentY);
          currentY += 14;
        }

        // Render Table Columns Header
        const colWidth = Math.floor(515 / (table.columns.length || 1));
        doc.rect(40, currentY, 515, 18).fill('#F1F5F9');
        doc.fillColor('#1E293B').fontSize(8).font('Helvetica-Bold');
        table.columns.forEach((col: string, idx: number) => {
          doc.text(col, 45 + idx * colWidth, currentY + 5, { width: colWidth - 8, lineBreak: false });
        });
        currentY += 20;

        // Render Table Rows
        doc.font('Helvetica').fontSize(8);
        for (const row of table.rows || []) {
          if (currentY > 750) {
            doc.addPage();
            currentY = 40;
          }
          doc.fillColor('#334155');
          doc.text(row.label, 45, currentY, { width: colWidth - 8, lineBreak: false });
          row.values.forEach((val: string, idx: number) => {
            doc.text(val, 45 + (idx + 1) * colWidth, currentY, { width: colWidth - 8, lineBreak: false });
          });
          currentY += 16;
          doc.moveTo(40, currentY - 2).lineTo(555, currentY - 2).strokeColor('#E2E8F0').lineWidth(0.5).stroke();
        }
        currentY += 10;
      }
    }

    // Notes
    if (product.notes && Array.isArray(product.notes) && product.notes.length > 0) {
      if (currentY > 730) {
        doc.addPage();
        currentY = 40;
      }
      doc.fillColor('#B45309').fontSize(9).font('Helvetica-Bold').text('ENGINEERING NOTES & CUSTOMIZATION', 40, currentY);
      currentY += 14;
      doc.font('Helvetica').fontSize(8).fillColor('#451A03');
      for (const note of product.notes as string[]) {
        doc.text(`• ${note}`, 45, currentY, { width: 505 });
        currentY = doc.y + 4;
      }
    }

    // Footer on page
    doc.rect(40, 780, 515, 25).fill('#F8FAFC');
    doc.fillColor('#64748B').fontSize(7).text('Official Technical Datasheet • Lift and Reach Equipments • https://liftandreach.in', 50, 788);

    doc.end();
  } catch (err) {
    console.error('Failed to generate PDF datasheet:', err);
    res.status(500).send('Error generating PDF');
  }
};

// GET /api/settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    res.json(map);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// GET /api/hero-slides
export const getHeroSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(slides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({ error: 'Failed to fetch hero slides' });
  }
};

// GET /api/pages/:slug
export const getPageBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const page = await prisma.page.findUnique({
      where: { slug }
    });

    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json(page);
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
};

// POST /api/enquiries with optional basket items support
const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  productId: z.number().optional().nullable(),
  productIds: z.array(z.number()).optional(), // Basket array of IDs
  captchaToken: z.string().min(1, 'Anti-spam token is required'),
  captchaAnswer: z.union([z.string(), z.number()])
});

export const submitEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = enquirySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
      return;
    }

    const { name, email, phone, subject, message, productId, productIds, captchaToken, captchaAnswer } = parseResult.data;

    // Verify anti-spam math problem
    const isHuman = verifyCaptchaToken(captchaToken, captchaAnswer);
    if (!isHuman) {
      res.status(400).json({ error: 'Incorrect or expired anti-spam answer. Please try again.' });
      return;
    }

    // Determine all product IDs to attach
    const allProductIds = new Set<number>();
    if (productId) allProductIds.add(productId);
    if (productIds && Array.isArray(productIds)) {
      productIds.forEach((id) => allProductIds.add(id));
    }

    // Create enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        productId: productId || (productIds && productIds[0]) || null,
        items: {
          create: Array.from(allProductIds).map((pId) => ({
            productId: pId
          }))
        }
      },
      include: {
        product: { select: { name: true, code: true } },
        items: {
          include: {
            product: { select: { name: true, code: true } }
          }
        }
      }
    });

    // Build email description
    const attachedProductNames = enquiry.items.map((i) => `${i.product.name} (${i.product.code || 'N/A'})`).join(', ');

    sendEnquiryEmail({
      name,
      email,
      phone,
      subject,
      message,
      productName: attachedProductNames || enquiry.product?.name,
      productCode: enquiry.product?.code
    }).catch((err) => console.error('Enquiry email trigger error:', err));

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Lift and Reach Equipments! We will get back to you shortly.',
      enquiryId: enquiry.id
    });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ error: 'Failed to submit your enquiry. Please call or email directly.' });
  }
};
