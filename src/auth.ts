  isVerified: boolean;
/**
 * Authentication module for user management
 */

import { createHash } from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  lastLogin?: Date;
  roles: string[];
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}

export interface AuthConfig {
  tokenExpiry: number;
  maxSessions: number;
  passwordMinLength: number;
  requireSpecialChar: boolean;
}

const defaultConfig: AuthConfig = {
  tokenExpiry: 3600000, // 1 hour
  maxSessions: 5,
  passwordMinLength: 8,
  requireSpecialChar: true,
};

/**
 * Hash a password using SHA-256
 */
export function hashPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

/**
 * Generate a random token for sessions
 */
export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string, config = defaultConfig): boolean {
  if (password.length < config.passwordMinLength) {
    return false;
  }

  if (config.requireSpecialChar) {
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecial) {
      return false;
    }
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
}

/**
 * Create a new user session
 */
export function createSession(userId: string, ipAddress: string, userAgent: string): Session {
  return {
    id: generateToken().substring(0, 16),
    userId,
    token: generateToken(),
    expiresAt: new Date(Date.now() + defaultConfig.tokenExpiry),
    ipAddress,
    userAgent,
  };
}

/**
 * Check if a session is valid
 */
export function isSessionValid(session: Session): boolean {
  return session.expiresAt > new Date();
}

/**
 * Refresh a session's expiry time
 */
export function refreshSession(session: Session): Session {
  return {
    ...session,
    expiresAt: new Date(Date.now() + defaultConfig.tokenExpiry),
  };
}

/**
 * Extract user ID from a token
 */
export function parseToken(token: string): { userId: string; sessionId: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [userId, sessionId] = decoded.split(':');
    if (userId && sessionId) {
      return { userId, sessionId };
    }
    return null;
  } catch {
    return null;
  }
}
