import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  exportEnquiriesCsv,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminGetHeroSlides,
  adminCreateHeroSlide,
  adminUpdateHeroSlide,
  adminDeleteHeroSlide,
  adminUpdateSettings,
  adminUpdatePage
} from '../controllers/adminController';
import { upload, handleImageUpload } from '../controllers/uploadController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Auth
router.post('/auth/login', adminLogin);
router.post('/auth/logout', adminLogout);
router.get('/auth/me', authenticateAdmin, getAdminProfile);

// Enquiries
router.get('/enquiries', authenticateAdmin, getEnquiries);
router.get('/enquiries/export.csv', authenticateAdmin, exportEnquiriesCsv);
router.put('/enquiries/:id/status', authenticateAdmin, updateEnquiryStatus);
router.delete('/enquiries/:id', authenticateAdmin, deleteEnquiry);

// Products
router.get('/products', authenticateAdmin, adminGetProducts);
router.post('/products', authenticateAdmin, adminCreateProduct);
router.put('/products/:id', authenticateAdmin, adminUpdateProduct);
router.delete('/products/:id', authenticateAdmin, adminDeleteProduct);

// Categories
router.get('/categories', authenticateAdmin, adminGetCategories);
router.post('/categories', authenticateAdmin, adminCreateCategory);
router.put('/categories/:id', authenticateAdmin, adminUpdateCategory);
router.delete('/categories/:id', authenticateAdmin, adminDeleteCategory);

// Hero Slides
router.get('/hero-slides', authenticateAdmin, adminGetHeroSlides);
router.post('/hero-slides', authenticateAdmin, adminCreateHeroSlide);
router.put('/hero-slides/:id', authenticateAdmin, adminUpdateHeroSlide);
router.delete('/hero-slides/:id', authenticateAdmin, adminDeleteHeroSlide);

// Settings and Pages
router.put('/settings', authenticateAdmin, adminUpdateSettings);
router.put('/pages/:slug', authenticateAdmin, adminUpdatePage);

// Image Upload
router.post('/upload', authenticateAdmin, upload.single('image'), handleImageUpload);

export default router;
