import jwt from 'jsonwebtoken';
import { JWTClaims, User, Membership } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

const ACCESS_TOKEN_EXPIRES_IN = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '14d'; // 14 days

export const generateAccessToken = (user: User, memberships: Membership[], currentOrg?: string): string => {
  const claims: JWTClaims = {
    sub: user.id,
    email: user.email,
    role: user.role,
    orgs: memberships.map(m => ({
      id: m.organization_id,
      role: m.org_role
    })),
    current_org: currentOrg,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
  };

  return jwt.sign(claims, JWT_SECRET, { 
    algorithm: 'HS256' 
    // Don't use expiresIn option when exp is already in payload
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { 
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      algorithm: 'HS256' 
    }
  );
};

export const verifyAccessToken = (token: string): JWTClaims => {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JWTClaims;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = (token: string): { sub: string; type: string } => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, { algorithms: ['HS256'] }) as { sub: string; type: string };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};