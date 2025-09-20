import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { verifyJWT, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);
router.use(requireAuth);

// Interface for tenant application data
interface TenantApplicationData {
  full_name: string;
  brand_name: string;
  phone_number: string;
  email: string;
  concept_description?: string;
  presentation_url?: string;
  notes?: string;
  organization_id?: string;
}

// POST /api/tenant-applications - Submit new tenant application (Public users)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      full_name,
      brand_name,
      phone_number,
      email,
      concept_description,
      presentation_url,
      notes
    }: TenantApplicationData = req.body;

    // Validate required fields
    const requiredFields = ['full_name', 'brand_name', 'phone_number', 'email'];
    const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Обязательные поля не заполнены: ${missingFields.join(', ')}`,
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Некорректный формат email',
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    // Validate phone number
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
    if (!phoneRegex.test(phone_number.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({
        error: 'Некорректный формат номера телефона',
        code: 'INVALID_PHONE_FORMAT'
      });
    }

    // Validate URL if provided
    if (presentation_url && presentation_url.trim() !== '') {
      try {
        new URL(presentation_url);
      } catch {
        return res.status(400).json({
          error: 'Некорректный формат ссылки на презентацию',
          code: 'INVALID_URL_FORMAT'
        });
      }
    }

    // Check organization context is required
    if (!req.user?.current_org) {
      return res.status(403).json({
        error: 'Организационный контекст обязателен для подачи заявки',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    const organization_id = req.user.current_org;

    // Check if application with this email already exists IN CURRENT ORGANIZATION (org-scoped uniqueness)
    const existingApplication = await query(
      'SELECT id FROM tenant_applications WHERE email = $1 AND organization_id = $2 AND deleted_at IS NULL',
      [email.trim().toLowerCase(), organization_id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(409).json({
        error: 'Заявка с таким email уже существует в вашей организации',
        code: 'EMAIL_ALREADY_EXISTS_IN_ORG'
      });
    }

    // Organization already validated above (organization_id = req.user.current_org)

    // Insert new application
    const applicationData = {
      full_name: full_name.trim(),
      brand_name: brand_name.trim(),
      phone_number: phone_number.trim(),
      email: email.trim().toLowerCase(),
      concept_description: concept_description?.trim() || null,
      presentation_url: presentation_url?.trim() || null,
      notes: notes?.trim() || null,
      status: 'pending',
      organization_id,
      applicant_user_id: req.user?.id
    };

    const result = await query(`
      INSERT INTO tenant_applications (
        full_name, brand_name, phone_number, email, 
        concept_description, presentation_url, notes, 
        status, organization_id, applicant_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, status, created_at
    `, [
      applicationData.full_name,
      applicationData.brand_name,
      applicationData.phone_number,
      applicationData.email,
      applicationData.concept_description,
      applicationData.presentation_url,
      applicationData.notes,
      applicationData.status,
      applicationData.organization_id,
      applicationData.applicant_user_id
    ]);

    // Log audit entry
    await query(`
      INSERT INTO audit_logs (
        table_name, record_id, action, actor_user_id, 
        new_values, organization_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'tenant_applications',
      result.rows[0].id,
      'INSERT',
      req.user?.id,
      JSON.stringify(applicationData),
      organization_id
    ]);

    res.status(201).json({
      success: true,
      message: 'Заявка успешно отправлена',
      application_id: result.rows[0].id,
      status: result.rows[0].status,
      created_at: result.rows[0].created_at
    });

  } catch (error) {
    console.error('Error submitting tenant application:', error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// GET /api/tenant-applications - List tenant applications (Admin only, org scoped)
router.get('/', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    // Check organization context
    if (!req.user?.current_org) {
      return res.status(403).json({
        error: 'Organization context required',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    // Parse query parameters
    const { 
      page = '1', 
      limit = '20', 
      status, 
      search,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clause
    let whereClause = 'WHERE ta.organization_id = $1 AND ta.deleted_at IS NULL';
    const queryParams: any[] = [req.user.current_org];
    let paramCount = 1;

    if (status && status !== 'all') {
      paramCount++;
      whereClause += ` AND ta.status = $${paramCount}`;
      queryParams.push(status);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (ta.full_name ILIKE $${paramCount} OR ta.brand_name ILIKE $${paramCount} OR ta.email ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Build ORDER BY clause
    const allowedSortFields = ['created_at', 'full_name', 'brand_name', 'status'];
    const sortField = allowedSortFields.includes(sort as string) ? sort : 'created_at';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total 
      FROM tenant_applications ta 
      ${whereClause}
    `, queryParams);

    const total = parseInt(countResult.rows[0].total);

    // Get applications with pagination
    const result = await query(`
      SELECT 
        ta.id,
        ta.full_name,
        ta.brand_name,
        ta.phone_number,
        ta.email,
        ta.concept_description,
        ta.presentation_url,
        ta.notes,
        ta.status,
        ta.created_at,
        ta.updated_at,
        p.display_name as applicant_name,
        o.name as organization_name
      FROM tenant_applications ta
      LEFT JOIN profiles p ON ta.applicant_user_id = p.id
      LEFT JOIN organizations o ON ta.organization_id = o.id
      ${whereClause}
      ORDER BY ta.${sortField} ${sortOrder}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...queryParams, limitNum, offset]);

    res.json({
      applications: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching tenant applications:', error);
    res.status(500).json({
      error: 'Ошибка при получении заявок',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/tenant-applications/:id - Get specific application (Admin only, org scoped)
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

    const result = await query(`
      SELECT 
        ta.*,
        p.display_name as applicant_name,
        p.email as applicant_email,
        o.name as organization_name,
        o.display_name as organization_display_name
      FROM tenant_applications ta
      LEFT JOIN profiles p ON ta.applicant_user_id = p.id
      LEFT JOIN organizations o ON ta.organization_id = o.id
      WHERE ta.id = $1 AND ta.organization_id = $2 AND ta.deleted_at IS NULL
    `, [id, req.user.current_org]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Заявка не найдена в вашей организации',
        code: 'APPLICATION_NOT_FOUND_IN_ORG'
      });
    }

    res.json({ application: result.rows[0] });

  } catch (error) {
    console.error('Error fetching tenant application:', error);
    res.status(500).json({
      error: 'Ошибка при получении заявки',
      code: 'FETCH_ERROR'
    });
  }
});

// PUT /api/tenant-applications/:id/status - Update application status (Admin only, org scoped)
router.put('/:id/status', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    // Validate status
    const allowedStatuses = ['pending', 'approved', 'rejected', 'contacted'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Некорректный статус заявки',
        code: 'INVALID_STATUS'
      });
    }

    // Check organization context
    if (!req.user?.current_org) {
      return res.status(403).json({
        error: 'Organization context required',
        code: 'ORG_CONTEXT_REQUIRED'
      });
    }

    // Get current application to verify org and capture old values
    const currentApp = await query(`
      SELECT status, admin_notes
      FROM tenant_applications 
      WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL
    `, [id, req.user.current_org]);

    if (currentApp.rows.length === 0) {
      return res.status(404).json({
        error: 'Заявка не найдена в вашей организации',
        code: 'APPLICATION_NOT_FOUND_IN_ORG'
      });
    }

    const oldValues = {
      status: currentApp.rows[0].status,
      admin_notes: currentApp.rows[0].admin_notes
    };

    // Update application
    const result = await query(`
      UPDATE tenant_applications 
      SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND organization_id = $4
      RETURNING id, status, updated_at
    `, [status, admin_notes || null, id, req.user.current_org]);

    // Log audit entry
    await query(`
      INSERT INTO audit_logs (
        table_name, record_id, action, actor_user_id,
        old_values, new_values, organization_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'tenant_applications',
      id,
      'UPDATE',
      req.user?.id,
      JSON.stringify(oldValues),
      JSON.stringify({ status, admin_notes }),
      req.user.current_org
    ]);

    res.json({
      success: true,
      message: 'Статус заявки обновлен',
      application: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating tenant application status:', error);
    res.status(500).json({
      error: 'Ошибка при обновлении статуса заявки',
      code: 'UPDATE_ERROR'
    });
  }
});

export default router;