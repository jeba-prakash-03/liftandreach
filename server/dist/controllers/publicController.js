"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiteContent = exports.submitEnquiry = exports.getPageBySlug = exports.getHeroSlides = exports.getSettings = exports.generateDatasheetPdf = exports.getProductBySlug = exports.getProducts = exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const zod_1 = require("zod");
const captcha_1 = require("../utils/captcha");
const mailer_1 = require("../utils/mailer");
const pdfkit_1 = __importDefault(require("pdfkit"));
// GET /api/categories (nested tree structure)
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany({
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
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
exports.getCategories = getCategories;
// GET /api/products?category=&sub=&q=&industry=&cap=&sort=
const getProducts = async (req, res) => {
    try {
        const { category, sub, q, industry, cap, sort } = req.query;
        const whereClause = { isActive: true };
        if (sub) {
            const subCat = await prisma_1.default.category.findUnique({
                where: { slug: String(sub) }
            });
            if (subCat) {
                whereClause.categoryId = subCat.id;
            }
        }
        else if (category && category !== 'all') {
            const cat = await prisma_1.default.category.findUnique({
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
        let orderBy = [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }];
        if (sort === 'name-asc') {
            orderBy = [{ name: 'asc' }];
        }
        else if (sort === 'name-desc') {
            orderBy = [{ name: 'desc' }];
        }
        const products = await prisma_1.default.product.findMany({
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
                const indList = p.industries || [];
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
                }
                else if (capQuery === '1t-3t') {
                    return str.includes('1 TON') || str.includes('1000') || str.includes('1.5T') || str.includes('2 TON') || str.includes('2000') || str.includes('2.5T') || str.includes('3 TON');
                }
                else if (capQuery === 'over-3t') {
                    return str.includes('9000') || str.includes('10000') || str.includes('12000') || str.includes('10 TON') || str.includes('20T') || str.includes('25 TON');
                }
                return true;
            });
        }
        // In-memory sort for capacity if requested
        if (sort === 'cap-asc' || sort === 'cap-desc') {
            const parseCap = (p) => {
                const text = (p.code || '') + ' ' + JSON.stringify(p.specTables || '');
                const matchTon = text.match(/(\d+(?:\.\d+)?)\s*(?:TON|T\b)/i);
                if (matchTon)
                    return parseFloat(matchTon[1]) * 1000;
                const matchKg = text.match(/(\d+)\s*Kg/i);
                if (matchKg)
                    return parseFloat(matchKg[1]);
                return 1000;
            };
            filtered.sort((a, b) => {
                const capA = parseCap(a);
                const capB = parseCap(b);
                return sort === 'cap-asc' ? capA - capB : capB - capA;
            });
        }
        res.json(filtered);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
exports.getProducts = getProducts;
// GET /api/products/:slug
const getProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await prisma_1.default.product.findUnique({
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
        const relatedProducts = await prisma_1.default.product.findMany({
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
    }
    catch (error) {
        console.error('Error fetching product by slug:', error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
};
exports.getProductBySlug = getProductBySlug;
// GET /api/products/:slug/datasheet.pdf
const generateDatasheetPdf = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await prisma_1.default.product.findUnique({
            where: { slug },
            include: { category: true }
        });
        if (!product) {
            res.status(404).send('Product not found');
            return;
        }
        const doc = new pdfkit_1.default({ margin: 40, size: 'A4' });
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
            for (const table of product.specTables) {
                if (table.title) {
                    doc.fillColor('#2F5FA8').fontSize(9).font('Helvetica-Bold').text(table.title, 40, currentY);
                    currentY += 14;
                }
                // Render Table Columns Header
                const colWidth = Math.floor(515 / (table.columns.length || 1));
                doc.rect(40, currentY, 515, 18).fill('#F1F5F9');
                doc.fillColor('#1E293B').fontSize(8).font('Helvetica-Bold');
                table.columns.forEach((col, idx) => {
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
                    row.values.forEach((val, idx) => {
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
            for (const note of product.notes) {
                doc.text(`• ${note}`, 45, currentY, { width: 505 });
                currentY = doc.y + 4;
            }
        }
        // Footer on page
        doc.rect(40, 780, 515, 25).fill('#F8FAFC');
        doc.fillColor('#64748B').fontSize(7).text('Official Technical Datasheet • Lift and Reach Equipments • https://liftandreach.in', 50, 788);
        doc.end();
    }
    catch (err) {
        console.error('Failed to generate PDF datasheet:', err);
        res.status(500).send('Error generating PDF');
    }
};
exports.generateDatasheetPdf = generateDatasheetPdf;
// GET /api/settings
const getSettings = async (req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany();
        const map = {};
        settings.forEach((s) => {
            map[s.key] = s.value;
        });
        res.json(map);
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};
exports.getSettings = getSettings;
// GET /api/hero-slides
const getHeroSlides = async (req, res) => {
    try {
        const slides = await prisma_1.default.heroSlide.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(slides);
    }
    catch (error) {
        console.error('Error fetching hero slides:', error);
        res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
};
exports.getHeroSlides = getHeroSlides;
// GET /api/pages/:slug
const getPageBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const page = await prisma_1.default.page.findUnique({
            where: { slug }
        });
        if (!page) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }
        res.json(page);
    }
    catch (error) {
        console.error('Error fetching page content:', error);
        res.status(500).json({ error: 'Failed to fetch page content' });
    }
};
exports.getPageBySlug = getPageBySlug;
// POST /api/enquiries with optional basket items support
const enquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Please enter a valid email address'),
    phone: zod_1.z.string().optional(),
    subject: zod_1.z.string().min(3, 'Subject must be at least 3 characters'),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters'),
    productId: zod_1.z.number().optional().nullable(),
    productIds: zod_1.z.array(zod_1.z.number()).optional(), // Basket array of IDs
    captchaToken: zod_1.z.string().min(1, 'Anti-spam token is required'),
    captchaAnswer: zod_1.z.union([zod_1.z.string(), zod_1.z.number()])
});
const submitEnquiry = async (req, res) => {
    try {
        const parseResult = enquirySchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
            return;
        }
        const { name, email, phone, subject, message, productId, productIds, captchaToken, captchaAnswer } = parseResult.data;
        // Verify anti-spam math problem
        const isHuman = (0, captcha_1.verifyCaptchaToken)(captchaToken, captchaAnswer);
        if (!isHuman) {
            res.status(400).json({ error: 'Incorrect or expired anti-spam answer. Please try again.' });
            return;
        }
        // Determine all product IDs to attach
        const allProductIds = new Set();
        if (productId)
            allProductIds.add(productId);
        if (productIds && Array.isArray(productIds)) {
            productIds.forEach((id) => allProductIds.add(id));
        }
        // Create enquiry
        const enquiry = await prisma_1.default.enquiry.create({
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
        (0, mailer_1.sendEnquiryEmail)({
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
    }
    catch (error) {
        console.error('Error saving enquiry:', error);
        res.status(500).json({ error: 'Failed to submit your enquiry. Please call or email directly.' });
    }
};
exports.submitEnquiry = submitEnquiry;
// GET /api/site-content
const getSiteContent = async (req, res) => {
    try {
        const rows = (await prisma_1.default.$queryRawUnsafe('SELECT section, data FROM site_content'));
        const result = {};
        for (const r of rows) {
            if (typeof r.data === 'string') {
                try {
                    result[r.section] = JSON.parse(r.data);
                }
                catch {
                    result[r.section] = r.data;
                }
            }
            else {
                result[r.section] = r.data;
            }
        }
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching site-content:', error);
        res.status(500).json({ error: 'Failed to load site content' });
    }
};
exports.getSiteContent = getSiteContent;
