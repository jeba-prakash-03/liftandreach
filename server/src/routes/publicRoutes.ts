import { Router } from 'express';
import {
  getCategories,
  getProducts,
  getProductBySlug,
  generateDatasheetPdf,
  getSettings,
  getHeroSlides,
  getPageBySlug,
  submitEnquiry,
  getSiteContent
} from '../controllers/publicController';
import { generateCaptcha } from '../utils/captcha';
import rateLimit from 'express-rate-limit';

const router = Router();

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many enquiries from this IP address, please try again in an hour or call us directly.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:slug/datasheet.pdf', generateDatasheetPdf);
router.get('/products/:slug', getProductBySlug);
router.get('/settings', getSettings);
router.get('/hero-slides', getHeroSlides);
router.get('/pages/:slug', getPageBySlug);
router.get('/site-content', getSiteContent);
router.get('/captcha', generateCaptcha);
router.post('/enquiries', enquiryLimiter, submitEnquiry);

export default router;
