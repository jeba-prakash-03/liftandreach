"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateAdmin = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/, '');
    if (!token) {
        res.status(401).json({ error: 'Unauthorized. Authentication token is missing.' });
        return;
    }
    const secret = process.env.JWT_SECRET || 'liftandreach_super_secure_jwt_secret_key_2026_xyz!';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
    }
};
exports.authenticateAdmin = authenticateAdmin;
