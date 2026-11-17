"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdatePage = exports.adminUpdateSettings = exports.adminDeleteHeroSlide = exports.adminUpdateHeroSlide = exports.adminCreateHeroSlide = exports.adminGetHeroSlides = exports.adminDeleteCategory = exports.adminUpdateCategory = exports.adminCreateCategory = exports.adminGetCategories = exports.adminDeleteProduct = exports.adminUpdateProduct = exports.adminCreateProduct = exports.adminGetProducts = exports.exportEnquiriesCsv = exports.deleteEnquiry = exports.updateEnquiryStatus = exports.getEnquiries = exports.getAdminProfile = exports.adminLogout = exports.adminLogin = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
// POST /api/admin/auth/login
const adminLogin = async (req, res) => {
    try {
        const parse = loginSchema.safeParse(req.body);
        if (!parse.success) {
            res.status(400).json({ error: 'Valid email and password required.' });
            return;
        }
        const { email, password } = parse.data;
        const admin = await prisma_1.default.admin.findUnique({ where: { email } });
        if (!admin) {
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }
        const secret = process.env.JWT_SECRET || 'liftandreach_super_secure_jwt_secret_key_2026_xyz!';
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, name: admin.name }, secret, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed.' });
    }
};
exports.adminLogin = adminLogin;
// POST /api/admin/auth/logout
const adminLogout = async (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully.' });
};
exports.adminLogout = adminLogout;
// GET /api/admin/auth/me
const getAdminProfile = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
    }
    res.json({ user: req.user });
};
exports.getAdminProfile = getAdminProfile;
// ---------------- ENQUIRIES ---------------- //
// GET /api/admin/enquiries
const getEnquiries = async (req, res) => {
    try {
        const { status, search } = req.query;
        const where = {};
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
        const enquiries = await prisma_1.default.enquiry.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                product: { select: { id: true, name: true, code: true, slug: true } },
                items: { include: { product: { select: { id: true, name: true, code: true } } } }
            }
        });
        res.json(enquiries);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch enquiries.' });
    }
};
exports.getEnquiries = getEnquiries;
// PUT /api/admin/enquiries/:id/status
const updateEnquiryStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { status } = req.body;
        if (!['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
            res.status(400).json({ error: 'Invalid status.' });
            return;
        }
        const updated = await prisma_1.default.enquiry.update({
            where: { id },
            data: { status }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update enquiry status.' });
    }
};
exports.updateEnquiryStatus = updateEnquiryStatus;
// DELETE /api/admin/enquiries/:id
const deleteEnquiry = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma_1.default.enquiry.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete enquiry.' });
    }
};
exports.deleteEnquiry = deleteEnquiry;
// GET /api/admin/enquiries/export.csv
const exportEnquiriesCsv = async (req, res) => {
    try {
        const enquiries = await prisma_1.default.enquiry.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'CSV export failed.' });
    }
};
exports.exportEnquiriesCsv = exportEnquiriesCsv;
// ---------------- PRODUCTS CRUD ---------------- //
// GET /api/admin/products
const adminGetProducts = async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                category: {
                    select: { id: true, name: true, slug: true, parent: { select: { name: true } } }
                }
            }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to load products.' });
    }
};
exports.adminGetProducts = adminGetProducts;
// POST /api/admin/products
const adminCreateProduct = async (req, res) => {
    try {
        const data = req.body;
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newProduct = await prisma_1.default.product.create({
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
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Failed to create product.' });
    }
};
exports.adminCreateProduct = adminCreateProduct;
// PUT /api/admin/products/:id
const adminUpdateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = req.body;
        const updated = await prisma_1.default.product.update({
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
    }
    catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product.' });
    }
};
exports.adminUpdateProduct = adminUpdateProduct;
// DELETE /api/admin/products/:id
const adminDeleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma_1.default.product.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product.' });
    }
};
exports.adminDeleteProduct = adminDeleteProduct;
// ---------------- CATEGORIES CRUD ---------------- //
const adminGetCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                parent: { select: { id: true, name: true } },
                _count: { select: { products: true, children: true } }
            }
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories.' });
    }
};
exports.adminGetCategories = adminGetCategories;
const adminCreateCategory = async (req, res) => {
    try {
        const data = req.body;
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const cat = await prisma_1.default.category.create({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create category.' });
    }
};
exports.adminCreateCategory = adminCreateCategory;
const adminUpdateCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = req.body;
        const updated = await prisma_1.default.category.update({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update category.' });
    }
};
exports.adminUpdateCategory = adminUpdateCategory;
const adminDeleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma_1.default.category.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete category.' });
    }
};
exports.adminDeleteCategory = adminDeleteCategory;
// ---------------- HERO SLIDES CRUD ---------------- //
const adminGetHeroSlides = async (req, res) => {
    try {
        const slides = await prisma_1.default.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } });
        res.json(slides);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch hero slides.' });
    }
};
exports.adminGetHeroSlides = adminGetHeroSlides;
const adminCreateHeroSlide = async (req, res) => {
    try {
        const data = req.body;
        const slide = await prisma_1.default.heroSlide.create({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create slide.' });
    }
};
exports.adminCreateHeroSlide = adminCreateHeroSlide;
const adminUpdateHeroSlide = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = req.body;
        const slide = await prisma_1.default.heroSlide.update({
            where: { id },
            data
        });
        res.json(slide);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update slide.' });
    }
};
exports.adminUpdateHeroSlide = adminUpdateHeroSlide;
const adminDeleteHeroSlide = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma_1.default.heroSlide.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete slide.' });
    }
};
exports.adminDeleteHeroSlide = adminDeleteHeroSlide;
// ---------------- SETTINGS & PAGE CONTENT ---------------- //
const adminUpdateSettings = async (req, res) => {
    try {
        const settings = req.body; // { key: value, ... }
        for (const [key, value] of Object.entries(settings)) {
            await prisma_1.default.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        }
        res.json({ success: true, message: 'Settings updated successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update settings.' });
    }
};
exports.adminUpdateSettings = adminUpdateSettings;
const adminUpdatePage = async (req, res) => {
    try {
        const slug = req.params.slug;
        const { title, content } = req.body;
        const updated = await prisma_1.default.page.upsert({
            where: { slug },
            update: { title, content },
            create: { slug, title, content }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update page.' });
    }
};
exports.adminUpdatePage = adminUpdatePage;
