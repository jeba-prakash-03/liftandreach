"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCaptcha = generateCaptcha;
exports.verifyCaptchaToken = verifyCaptchaToken;
const crypto_1 = __importDefault(require("crypto"));
const captchaStore = new Map();
// Periodic cleanup of expired captchas
setInterval(() => {
    const now = Date.now();
    for (const [key, val] of captchaStore.entries()) {
        if (val.expires < now) {
            captchaStore.delete(key);
        }
    }
}, 60 * 1000);
function generateCaptcha(req, res) {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const answer = num1 + num2;
    const token = crypto_1.default.randomBytes(16).toString('hex');
    // Valid for 10 minutes
    captchaStore.set(token, {
        question: `${num1} + ${num2} = ?`,
        answer,
        token,
        expires: Date.now() + 10 * 60 * 1000
    });
    res.json({
        token,
        question: `${num1} + ${num2} = ?`
    });
}
function verifyCaptchaToken(token, answer) {
    if (!token)
        return false;
    const stored = captchaStore.get(token);
    if (!stored)
        return false;
    captchaStore.delete(token); // one-time use
    if (stored.expires < Date.now())
        return false;
    return Number(answer) === stored.answer;
}
