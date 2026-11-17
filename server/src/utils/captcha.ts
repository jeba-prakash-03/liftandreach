import { Request, Response } from 'express';
import crypto from 'crypto';

interface MathCaptcha {
  question: string;
  answer: number;
  token: string;
  expires: number;
}

const captchaStore = new Map<string, MathCaptcha>();

// Periodic cleanup of expired captchas
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of captchaStore.entries()) {
    if (val.expires < now) {
      captchaStore.delete(key);
    }
  }
}, 60 * 1000);

export function generateCaptcha(req: Request, res: Response) {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const answer = num1 + num2;
  const token = crypto.randomBytes(16).toString('hex');

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

export function verifyCaptchaToken(token: string, answer: number | string): boolean {
  if (!token) return false;
  const stored = captchaStore.get(token);
  if (!stored) return false;

  captchaStore.delete(token); // one-time use

  if (stored.expires < Date.now()) return false;
  return Number(answer) === stored.answer;
}
