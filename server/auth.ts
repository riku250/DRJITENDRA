import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'maa-janki-clinic-secure-key-2025-xray-ortho';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    username: string;
    name?: string;
    role: string;
  };
}

export function generateToken(payload: { id: string; username: string; name?: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // Check auth header or cookie
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Unauthorized. Admin authentication required.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired authentication token.' });
  }
}

// Simple in-memory IP rate limiter to prevent spamming appointment / contact forms
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(limit: number = 20, windowMs: number = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = requestCounts.get(ip);
    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= limit) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please slow down and try again later.'
      });
      return;
    }

    record.count++;
    next();
  };
}
