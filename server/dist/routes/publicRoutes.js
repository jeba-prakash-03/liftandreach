"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const captcha_1 = require("../utils/captcha");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const enquiryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { error: 'Too many enquiries from this IP address, please try again in an hour or call us directly.' },
    standardHeaders: true,
    legacyHeaders: false
});
router.get('/categories', publicController_1.getCategories);
router.get('/products', publicController_1.getProducts);
router.get('/products/:slug/datasheet.pdf', publicController_1.generateDatasheetPdf);
router.get('/products/:slug', publicController_1.getProductBySlug);
router.get('/settings', publicController_1.getSettings);
router.get('/hero-slides', publicController_1.getHeroSlides);
router.get('/pages/:slug', publicController_1.getPageBySlug);
router.get('/site-content', publicController_1.getSiteContent);
router.get('/captcha', captcha_1.generateCaptcha);
router.post('/enquiries', enquiryLimiter, publicController_1.submitEnquiry);
exports.default = router;
