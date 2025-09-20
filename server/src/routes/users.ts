import express, { Request, Response } from 'express';
import { query } from '../config/database';
import { verifyJWT, requireAuth, requireRole } from '../middleware/auth';
import { User } from '../types/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT, requireAuth);

// GET /api/users - List users in current org (Admin only with org context)
router.get('/', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    // Check if user has organization context
    if (!req.user?.current_org) {
      return res.status(403).json({
        error: 'Organization context required for user management',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    // Only show users from current organization
    const result = await query(`
      SELECT DISTINCT
        p.id,
        p.email,
        p.role,
        p.display_name,
        p.first_name,
        p.last_name,
        p.is_active,
        p.last_login_at,
        p.created_at
      FROM profiles p
      JOIN organization_memberships om ON p.id = om.user_id
      WHERE p.deleted_at IS NULL 
        AND om.organization_id = $1
        AND om.status = 'active'
      ORDER BY p.created_at DESC
    `, [req.user.current_org]);

    const users: User[] = result.rows;

    res.json({
      success: true,
      users: users,
      count: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'FETCH_USERS_ERROR'
    });
  }
});

// GET /api/users/:id - Get specific user (Admin only, org scoped)
router.get('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check organization context
    if (!req.user?.current_org) {
      return res.status(403).json({
        error: 'Organization context required',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    // Only get user if they belong to current organization
    const result = await query(`
      SELECT 
        p.id,
        p.email,
        p.role,
        p.display_name,
        p.first_name,
        p.last_name,
        p.is_active,
        p.last_login_at,
        p.created_at
      FROM profiles p
      JOIN organization_memberships om ON p.id = om.user_id
      WHERE p.id = $1 AND p.deleted_at IS NULL
        AND om.organization_id = $2 AND om.status = 'active'
    `, [id, req.user.current_org]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found in your organization',
        code: 'USER_NOT_FOUND_IN_ORG'
      });
    }

    const user: User = result.rows[0];

    // Get user's memberships only for current organization (org scoped)
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
        AND om.organization_id = $2
      ORDER BY om.created_at ASC
    `, [id, req.user.current_org]);

    const memberships = membershipResult.rows.map(row => ({
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

    res.json({
      success: true,
      user: user,
      memberships: memberships
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'FETCH_USER_ERROR'
    });
  }
});

// PUT /api/users/:id/role - Update user role (Admin only, org scoped)
router.put('/:id/role', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !['admin', 'investor', 'tenant', 'public'].includes(role)) {
      return res.status(400).json({
        error: 'Valid role is required (admin, investor, tenant, public)',
        code: 'INVALID_ROLE'
      });
    }

    // Check if user exists and belongs to current org
    if (!req.user?.current_org) {
      return res.status(403).json({
        error: 'Organization context required',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    const userCheck = await query(`
      SELECT p.id, p.role 
      FROM profiles p
      JOIN organization_memberships om ON p.id = om.user_id
      WHERE p.id = $1 AND p.deleted_at IS NULL 
        AND om.organization_id = $2 AND om.status = 'active'
    `, [id, req.user.current_org]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found in your organization',
        code: 'USER_NOT_FOUND_IN_ORG'
      });
    }

    // Update user role
    const result = await query(`
      UPDATE profiles 
      SET role = $1, updated_at = NOW()
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING id, email, role, display_name, is_active, last_login_at, created_at
    `, [role, id]);

    const updatedUser: User = result.rows[0];

    // Log the role change in audit_logs
    await query(`
      INSERT INTO audit_logs (
        table_name, 
        record_id, 
        action, 
        old_values, 
        new_values, 
        user_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [
      'profiles',
      id,
      'role_change',
      JSON.stringify({ role: userCheck.rows[0].role }),
      JSON.stringify({ role: role }),
      req.user?.sub
    ]);

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'UPDATE_ROLE_ERROR'
    });
  }
});

// PUT /api/users/:id/status - Update user active status (Admin only, org scoped)
router.put('/:id/status', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Validate status
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        error: 'is_active must be a boolean',
        code: 'INVALID_STATUS'
      });
    }

    // Check if user exists and belongs to current org
    if (!req.user?.current_org) {
      return res.status(403).json({
        error: 'Organization context required',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    const userCheck = await query(`
      SELECT p.id, p.is_active 
      FROM profiles p
      JOIN organization_memberships om ON p.id = om.user_id
      WHERE p.id = $1 AND p.deleted_at IS NULL 
        AND om.organization_id = $2 AND om.status = 'active'
    `, [id, req.user.current_org]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found in your organization',
        code: 'USER_NOT_FOUND_IN_ORG'
      });
    }

    // Update user status
    const result = await query(`
      UPDATE profiles 
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING id, email, role, display_name, is_active, last_login_at, created_at
    `, [is_active, id]);

    const updatedUser: User = result.rows[0];

    // Log the status change in audit_logs
    await query(`
      INSERT INTO audit_logs (
        table_name, 
        record_id, 
        action, 
        old_values, 
        new_values, 
        user_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [
      'profiles',
      id,
      'status_change',
      JSON.stringify({ is_active: userCheck.rows[0].is_active }),
      JSON.stringify({ is_active: is_active }),
      req.user?.sub
    ]);

    res.json({
      success: true,
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'UPDATE_STATUS_ERROR'
    });
  }
});

// POST /api/users/:id/organizations - Add user to current organization (Admin only, org scoped)
router.post('/:id/organizations', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    const { org_role = 'member' } = req.body;

    // Check organization context
    if (!req.user?.current_org) {
      return res.status(403).json({
        error: 'Organization context required',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    // Use current organization (no arbitrary org_id allowed)
    const organization_id = req.user.current_org;

    if (!['owner', 'admin', 'member', 'viewer'].includes(org_role)) {
      return res.status(400).json({
        error: 'Invalid org_role. Must be owner, admin, member, or viewer',
        code: 'INVALID_ORG_ROLE'
      });
    }

    // Check if user exists
    const userCheck = await query('SELECT id FROM profiles WHERE id = $1 AND deleted_at IS NULL', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Organization existence already guaranteed by JWT current_org context

    // Check if membership already exists for current org
    const membershipCheck = await query(
      'SELECT id FROM organization_memberships WHERE user_id = $1 AND organization_id = $2',
      [userId, organization_id]
    );
    
    if (membershipCheck.rows.length > 0) {
      return res.status(409).json({
        error: 'User is already a member of your organization',
        code: 'MEMBERSHIP_EXISTS'
      });
    }

    // Create membership
    const result = await query(`
      INSERT INTO organization_memberships (
        user_id, 
        organization_id, 
        org_role, 
        status,
        created_at
      ) VALUES ($1, $2, $3, 'active', NOW())
      RETURNING *
    `, [userId, organization_id, org_role]);

    // Log the membership addition
    await query(`
      INSERT INTO audit_logs (
        table_name, 
        record_id, 
        action, 
        new_values, 
        user_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
    `, [
      'organization_memberships',
      result.rows[0].id,
      'membership_added',
      JSON.stringify({ user_id: userId, organization_id, org_role }),
      req.user?.sub
    ]);

    res.status(201).json({
      success: true,
      message: 'User added to organization successfully',
      membership: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding user to organization:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'ADD_MEMBERSHIP_ERROR'
    });
  }
});

export default router;