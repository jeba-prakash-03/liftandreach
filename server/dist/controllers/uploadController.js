"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImageUpload = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});
const handleImageUpload = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No image uploaded' });
            return;
        }
        const uploadDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        const filenameBase = `product-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
        const webpFilename = `${filenameBase}.webp`;
        const jpegFilename = `${filenameBase}.jpg`;
        const webpPath = path_1.default.join(uploadDir, webpFilename);
        const jpegPath = path_1.default.join(uploadDir, jpegFilename);
        // Convert to webp with high quality
        await (0, sharp_1.default)(req.file.buffer)
            .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(webpPath);
        // JPEG fallback
        await (0, sharp_1.default)(req.file.buffer)
            .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(jpegPath);
        res.json({
            success: true,
            url: `/uploads/${webpFilename}`,
            fallbackUrl: `/uploads/${jpegFilename}`
        });
    }
    catch (error) {
        console.error('Image processing error:', error);
        res.status(500).json({ error: 'Failed to process and optimize image.' });
    }
};
exports.handleImageUpload = handleImageUpload;
