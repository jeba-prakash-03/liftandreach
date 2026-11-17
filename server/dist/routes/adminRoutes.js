"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const uploadController_1 = require("../controllers/uploadController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Auth
router.post('/auth/login', adminController_1.adminLogin);
router.post('/auth/logout', adminController_1.adminLogout);
router.get('/auth/me', auth_1.authenticateAdmin, adminController_1.getAdminProfile);
// Enquiries
router.get('/enquiries', auth_1.authenticateAdmin, adminController_1.getEnquiries);
router.get('/enquiries/export.csv', auth_1.authenticateAdmin, adminController_1.exportEnquiriesCsv);
router.put('/enquiries/:id/status', auth_1.authenticateAdmin, adminController_1.updateEnquiryStatus);
router.delete('/enquiries/:id', auth_1.authenticateAdmin, adminController_1.deleteEnquiry);
// Products
router.get('/products', auth_1.authenticateAdmin, adminController_1.adminGetProducts);
router.post('/products', auth_1.authenticateAdmin, adminController_1.adminCreateProduct);
router.put('/products/:id', auth_1.authenticateAdmin, adminController_1.adminUpdateProduct);
router.delete('/products/:id', auth_1.authenticateAdmin, adminController_1.adminDeleteProduct);
// Categories
router.get('/categories', auth_1.authenticateAdmin, adminController_1.adminGetCategories);
router.post('/categories', auth_1.authenticateAdmin, adminController_1.adminCreateCategory);
router.put('/categories/:id', auth_1.authenticateAdmin, adminController_1.adminUpdateCategory);
router.delete('/categories/:id', auth_1.authenticateAdmin, adminController_1.adminDeleteCategory);
// Hero Slides
router.get('/hero-slides', auth_1.authenticateAdmin, adminController_1.adminGetHeroSlides);
router.post('/hero-slides', auth_1.authenticateAdmin, adminController_1.adminCreateHeroSlide);
router.put('/hero-slides/:id', auth_1.authenticateAdmin, adminController_1.adminUpdateHeroSlide);
router.delete('/hero-slides/:id', auth_1.authenticateAdmin, adminController_1.adminDeleteHeroSlide);
// Settings and Pages
router.put('/settings', auth_1.authenticateAdmin, adminController_1.adminUpdateSettings);
router.put('/pages/:slug', auth_1.authenticateAdmin, adminController_1.adminUpdatePage);
// Image Upload
router.post('/upload', auth_1.authenticateAdmin, uploadController_1.upload.single('image'), uploadController_1.handleImageUpload);
exports.default = router;
