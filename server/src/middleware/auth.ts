import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { JWTClaims } from '../types/auth';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JWTClaims;
    }
  }
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'TOKEN_INVALID'
    });
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }
  next();
};

export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
        code: 'INSUFFICIENT_ROLE'
      });
    }

    next();
  };
};

export const requireOrg = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.current_org) {
    return res.status(403).json({ 
      error: 'Organization context required. Please switch to an organization.',
      code: 'ORG_CONTEXT_REQUIRED'
    });
  }

  next();
};

export const requireOrgRole = (requiredRole: string | string[]) => {
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.current_org) {
      return res.status(403).json({ 
        error: 'Organization context required',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    const userOrgMembership = req.user.orgs.find(org => org.id === req.user?.current_org);
    
    if (!userOrgMembership) {
      return res.status(403).json({ 
        error: 'User is not a member of the current organization',
        code: 'NOT_ORG_MEMBER'
      });
    }

    if (!allowedRoles.includes(userOrgMembership.role)) {
      return res.status(403).json({ 
        error: `Insufficient organization permissions. Required: ${allowedRoles.join(', ')}`,
        code: 'INSUFFICIENT_ORG_ROLE'
      });
    }

    next();
  };
};