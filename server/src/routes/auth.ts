import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { query } from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { verifyJWT, requireAuth } from '../middleware/auth';
import { 
  User, 
  Membership, 
  Organization, 
  LoginRequest, 
  RegisterRequest, 
  SwitchOrgRequest,
  AuthUser 
} from '../types/auth';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts. Try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Hash password utility
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // High security cost
  return await bcrypt.hash(password, saltRounds);
};

// Get user with memberships
const getUserWithMemberships = async (email: string): Promise<{ user: User; memberships: Membership[] } | null> => {
  try {
    // Get user
    const userResult = await query(
      'SELECT * FROM profiles WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      return null;
    }

    const user: User = userResult.rows[0];

    // Get user's organization memberships
    const membershipResult = await query(`
      SELECT 
        om.*,
        o.id as org_id,
        o.name as org_name,
        o.display_name as org_display_name,
        o.slug as org_slug,
        o.business_type as org_business_type,
        o.is_active as org_is_active
      FROM organization_memberships om
      JOIN organizations o ON om.organization_id = o.id
      WHERE om.user_id = $1 AND om.status = 'active' AND o.is_active = true
      ORDER BY om.created_at ASC
    `, [user.id]);

    const memberships: Membership[] = membershipResult.rows.map(row => ({
      id: row.id,
      organization_id: row.organization_id,
      user_id: row.user_id,
      org_role: row.org_role,
      status: row.status,
      organization: {
        id: row.org_id,
        name: row.org_name,
        display_name: row.org_display_name,
        slug: row.org_slug,
        business_type: row.org_business_type,
        is_active: row.org_is_active
      }
    }));

    return { user, memberships };
  } catch (error) {
    console.error('Error getting user with memberships:', error);
    return null;
  }
};

// POST /api/auth/register
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password, role, first_name, last_name, display_name }: RegisterRequest = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ 
        error: 'Email, password, and role are required',
        code: 'MISSING_FIELDS'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long',
        code: 'PASSWORD_TOO_SHORT'
      });
    }

    if (!['tenant', 'investor'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be tenant or investor',
        code: 'INVALID_ROLE'
      });
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM profiles WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userResult = await query(`
      INSERT INTO profiles (email, password_hash, role, first_name, last_name, display_name, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING *
    `, [email, passwordHash, role, first_name, last_name, display_name || first_name]);

    const user: User = userResult.rows[0];

    // For new users, create default organization membership if needed
    // (In a real app, this might be handled differently)
    const memberships: Membership[] = [];

    // Generate tokens
    const accessToken = generateAccessToken(user, memberships);
    const refreshToken = generateRefreshToken(user.id);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
    });

    // Return user data and access token
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      display_name: user.display_name,
      memberships: memberships,
      current_org: undefined
    };

    res.status(201).json({
      success: true,
      user: authUser,
      access_token: accessToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Get user with memberships
    const userData = await getUserWithMemberships(email);
    if (!userData) {
      return res.status(401).json({ 
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const { user, memberships } = userData;

    // Verify password
    if (!user.password_hash) {
      return res.status(401).json({ 
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    await query('UPDATE profiles SET last_login_at = NOW() WHERE id = $1', [user.id]);

    // Determine current org (first active membership)
    const currentOrg = memberships.length > 0 ? memberships[0].organization : undefined;

    // Generate tokens
    const accessToken = generateAccessToken(user, memberships, currentOrg?.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
    });

    // Return user data and access token
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      display_name: user.display_name,
      memberships: memberships,
      current_org: currentOrg
    };

    res.json({
      success: true,
      user: authUser,
      access_token: accessToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login',
      code: 'LOGIN_ERROR'
    });
  }
});

// GET /api/auth/me
router.get('/me', verifyJWT, requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Get fresh user data with memberships
    const userData = await getUserWithMemberships(req.user.email);
    if (!userData) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const { user, memberships } = userData;

    // Find current org
    const currentOrg = req.user.current_org 
      ? memberships.find(m => m.organization_id === req.user?.current_org)?.organization
      : memberships[0]?.organization;

    // Return user data
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      display_name: user.display_name,
      memberships: memberships,
      current_org: currentOrg
    };

    res.json({
      success: true,
      user: authUser
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'GET_USER_ERROR'
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ 
        error: 'Refresh token not provided',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ 
        error: 'Invalid refresh token type',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Get user with memberships
    const userResult = await query('SELECT * FROM profiles WHERE id = $1 AND is_active = true', [decoded.sub]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user: User = userResult.rows[0];

    // Get memberships
    const userData = await getUserWithMemberships(user.email);
    if (!userData) {
      return res.status(401).json({ 
        error: 'User data not found',
        code: 'USER_DATA_NOT_FOUND'
      });
    }

    const { memberships } = userData;

    // Determine current org (preserve from old token or use first)
    const currentOrg = memberships.length > 0 ? memberships[0].organization : undefined;

    // Generate new access token
    const accessToken = generateAccessToken(user, memberships, currentOrg?.id);

    res.json({
      success: true,
      access_token: accessToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ 
      error: 'Invalid refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
});

// POST /api/auth/switch-org
router.post('/switch-org', verifyJWT, requireAuth, async (req: Request, res: Response) => {
  try {
    const { organization_id }: SwitchOrgRequest = req.body;

    if (!organization_id) {
      return res.status(400).json({ 
        error: 'Organization ID is required',
        code: 'MISSING_ORG_ID'
      });
    }

    if (!req.user) {
      return res.status(401).json({ 
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Verify user is member of the organization
    const membershipResult = await query(`
      SELECT om.*, o.name, o.display_name, o.slug, o.business_type, o.is_active
      FROM organization_memberships om
      JOIN organizations o ON om.organization_id = o.id
      WHERE om.user_id = $1 AND om.organization_id = $2 AND om.status = 'active' AND o.is_active = true
    `, [req.user.sub, organization_id]);

    if (membershipResult.rows.length === 0) {
      return res.status(403).json({ 
        error: 'You are not a member of this organization',
        code: 'NOT_ORG_MEMBER'
      });
    }

    // Get user with all memberships
    const userData = await getUserWithMemberships(req.user.email);
    if (!userData) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const { user, memberships } = userData;

    // Generate new access token with updated current_org
    const accessToken = generateAccessToken(user, memberships, organization_id);

    // Find the new current org
    const currentOrg = memberships.find(m => m.organization_id === organization_id)?.organization;

    res.json({
      success: true,
      access_token: accessToken,
      current_org: currentOrg
    });

  } catch (error) {
    console.error('Switch org error:', error);
    res.status(500).json({ 
      error: 'Internal server error during org switch',
      code: 'SWITCH_ORG_ERROR'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;