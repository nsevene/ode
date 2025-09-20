import express, { Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import { verifyJWT, requireAuth, requireOrg } from '../middleware/auth';

const router = express.Router();

// Storage configuration
const STORAGE_BASE_PATH = process.env.STORAGE_BASE_PATH || path.join(process.cwd(), '../storage');
const HMAC_SECRET = process.env.HMAC_SECRET || 'storage-hmac-secret-change-in-production';
const SIGNED_URL_EXPIRY = 15 * 60; // 15 minutes

// Interface for storage buckets
interface StorageBucket {
  id: string;
  name: string;
  description: string;
  public_access: boolean;
  allowed_mime_types: string[];
  max_file_size_bytes: number;
  storage_path: string;
  require_authentication: boolean;
  allowed_roles: string[];
}

// Default storage buckets
const STORAGE_BUCKETS: StorageBucket[] = [
  {
    id: 'applications',
    name: 'Tenant Applications',
    description: 'Documents and files for tenant applications',
    public_access: false,
    allowed_mime_types: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    max_file_size_bytes: 10 * 1024 * 1024, // 10MB
    storage_path: 'applications',
    require_authentication: true,
    allowed_roles: ['admin', 'tenant']
  },
  {
    id: 'documents',
    name: 'Organization Documents',
    description: 'Private documents for organizations',
    public_access: false,
    allowed_mime_types: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    max_file_size_bytes: 25 * 1024 * 1024, // 25MB
    storage_path: 'documents',
    require_authentication: true,
    allowed_roles: ['admin', 'tenant', 'investor']
  },
  {
    id: 'images',
    name: 'Images',
    description: 'Property and organization images',
    public_access: false,
    allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp'],
    max_file_size_bytes: 5 * 1024 * 1024, // 5MB
    storage_path: 'images',
    require_authentication: true,
    allowed_roles: ['admin', 'tenant', 'investor']
  },
  {
    id: 'presentations',
    name: 'Presentations',
    description: 'Investment and business presentations',
    public_access: false,
    allowed_mime_types: ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    max_file_size_bytes: 50 * 1024 * 1024, // 50MB
    storage_path: 'presentations',
    require_authentication: true,
    allowed_roles: ['admin', 'investor']
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Financial and business reports',
    public_access: false,
    allowed_mime_types: ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    max_file_size_bytes: 15 * 1024 * 1024, // 15MB
    storage_path: 'reports',
    require_authentication: true,
    allowed_roles: ['admin', 'investor']
  }
];

// Utility functions
const getBucket = (bucketName: string): StorageBucket | null => {
  return STORAGE_BUCKETS.find(b => b.id === bucketName) || null;
};

const generateUUID = (): string => {
  return crypto.randomUUID();
};

const createSignedUrl = (filePath: string, expiresIn: number = SIGNED_URL_EXPIRY): string => {
  const expiry = Math.floor(Date.now() / 1000) + expiresIn;
  const payload = `${filePath}:${expiry}`;
  const signature = crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');
  return `/api/storage/file?path=${encodeURIComponent(filePath)}&signature=${signature}&expires=${expiry}`;
};

const verifySignedUrl = (filePath: string, signature: string, expires: number): boolean => {
  const now = Math.floor(Date.now() / 1000);
  if (now > expires) return false;

  const payload = `${filePath}:${expires}`;
  const expectedSignature = crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');
  return signature === expectedSignature;
};

const buildOrgScopedPath = (bucketName: string, orgId: string, entityType?: string, entityId?: string, filename?: string): string => {
  let orgPath = path.join(STORAGE_BASE_PATH, 'private', bucketName, orgId);
  
  if (entityType) {
    orgPath = path.join(orgPath, entityType);
  }
  
  if (entityId) {
    orgPath = path.join(orgPath, entityId);
  }
  
  if (filename) {
    orgPath = path.join(orgPath, filename);
  }
  
  return orgPath;
};

const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
};

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max, will be validated per bucket
  },
  fileFilter: (req, file, cb) => {
    // Basic validation - will be validated more thoroughly per bucket
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// GET /api/storage/buckets - Get all available storage buckets
router.get('/buckets', verifyJWT, requireAuth, (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Filter buckets based on user role
    const accessibleBuckets = STORAGE_BUCKETS.filter(bucket => 
      bucket.allowed_roles.includes(req.user!.role) || req.user!.role === 'admin'
    );

    res.json({
      success: true,
      buckets: accessibleBuckets
    });
  } catch (error) {
    console.error('Error fetching buckets:', error);
    res.status(500).json({ error: 'Failed to fetch buckets' });
  }
});

// POST /api/storage/validate - Validate file before upload
router.post('/validate', verifyJWT, requireAuth, requireOrg, (req: Request, res: Response) => {
  try {
    const { bucket_name, filename, file_size, mime_type } = req.body;

    if (!bucket_name || !filename || !file_size || !mime_type) {
      return res.status(400).json({
        valid: false,
        error_message: 'Missing required fields: bucket_name, filename, file_size, mime_type'
      });
    }

    const bucket = getBucket(bucket_name);
    if (!bucket) {
      return res.status(400).json({
        valid: false,
        error_message: 'Invalid bucket name'
      });
    }

    // Check role permissions
    if (!bucket.allowed_roles.includes(req.user!.role) && req.user!.role !== 'admin') {
      return res.status(403).json({
        valid: false,
        error_message: 'You do not have permission to upload to this bucket'
      });
    }

    // Check file size
    if (file_size > bucket.max_file_size_bytes) {
      return res.status(400).json({
        valid: false,
        error_message: `File size exceeds limit of ${Math.round(bucket.max_file_size_bytes / (1024 * 1024))}MB`
      });
    }

    // Check MIME type
    if (!bucket.allowed_mime_types.includes(mime_type)) {
      return res.status(400).json({
        valid: false,
        error_message: `File type ${mime_type} is not allowed for this bucket`
      });
    }

    // Generate org-scoped file path
    const uuid = generateUUID();
    const fileExtension = path.extname(filename);
    const uniqueFilename = `${uuid}${fileExtension}`;
    
    const filePath = `private/${bucket_name}/${req.user!.current_org}/files/${uniqueFilename}`;

    res.json({
      valid: true,
      error_message: '',
      file_path: filePath
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      valid: false,
      error_message: 'Internal server error during validation'
    });
  }
});

// POST /api/storage/upload - Upload file to storage bucket
router.post('/upload', verifyJWT, requireAuth, requireOrg, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { bucket_name, entity_type, entity_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    if (!bucket_name) {
      return res.status(400).json({
        success: false,
        error: 'Bucket name is required'
      });
    }

    const bucket = getBucket(bucket_name);
    if (!bucket) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bucket name'
      });
    }

    // Check role permissions
    if (!bucket.allowed_roles.includes(req.user!.role) && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to upload to this bucket'
      });
    }

    // Validate file
    if (file.size > bucket.max_file_size_bytes) {
      return res.status(400).json({
        success: false,
        error: `File size exceeds limit of ${Math.round(bucket.max_file_size_bytes / (1024 * 1024))}MB`
      });
    }

    if (!bucket.allowed_mime_types.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: `File type ${file.mimetype} is not allowed for this bucket`
      });
    }

    // Generate unique filename
    const uuid = generateUUID();
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${uuid}${fileExtension}`;

    // Build org-scoped path
    const orgScopedPath = buildOrgScopedPath(
      bucket_name,
      req.user!.current_org!,
      entity_type,
      entity_id,
      uniqueFilename
    );

    // Ensure directory exists
    await ensureDirectoryExists(path.dirname(orgScopedPath));

    // Write file
    await fs.writeFile(orgScopedPath, file.buffer);

    // Create relative path for response
    const relativePath = path.relative(STORAGE_BASE_PATH, orgScopedPath);
    
    // Generate signed URL
    const signedUrl = createSignedUrl(relativePath);

    res.json({
      success: true,
      file_path: relativePath,
      file_url: signedUrl,
      original_name: file.originalname,
      size: file.size,
      mime_type: file.mimetype
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during upload'
    });
  }
});

// DELETE /api/storage/delete - Delete file from storage
router.delete('/delete', verifyJWT, requireAuth, requireOrg, async (req: Request, res: Response) => {
  try {
    const { file_path } = req.body;

    if (!file_path) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      });
    }

    // Verify file is org-scoped to current user's org
    const currentOrg = req.user!.current_org;
    if (!file_path.includes(`/${currentOrg}/`)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this file'
      });
    }

    const fullPath = path.join(STORAGE_BASE_PATH, file_path);
    
    try {
      await fs.unlink(fullPath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during delete'
    });
  }
});

// POST /api/storage/signed-url - Generate signed URL for private file access
router.post('/signed-url', verifyJWT, requireAuth, requireOrg, (req: Request, res: Response) => {
  try {
    const { file_path, expires_in = SIGNED_URL_EXPIRY } = req.body;

    if (!file_path) {
      return res.status(400).json({
        error: 'File path is required'
      });
    }

    // Verify file is org-scoped to current user's org
    const currentOrg = req.user!.current_org;
    if (!file_path.includes(`/${currentOrg}/`)) {
      return res.status(403).json({
        error: 'Access denied to this file'
      });
    }

    const signedUrl = createSignedUrl(file_path, expires_in);

    res.json({
      signed_url: signedUrl,
      expires_in: expires_in
    });

  } catch (error) {
    console.error('Signed URL error:', error);
    res.status(500).json({
      error: 'Internal server error generating signed URL'
    });
  }
});

// GET /api/storage/file - Serve file with signed URL verification (using query parameter)
router.get('/file', async (req: Request, res: Response) => {
  try {
    const filePath = req.query.path as string; // Get the filepath from query parameter
    const { signature, expires } = req.query;

    if (!signature || !expires) {
      return res.status(400).json({
        error: 'Signature and expires parameters are required'
      });
    }

    const expiresNum = parseInt(expires as string);
    if (!verifySignedUrl(filePath, signature as string, expiresNum)) {
      return res.status(403).json({
        error: 'Invalid or expired signature'
      });
    }

    const fullPath = path.join(STORAGE_BASE_PATH, filePath);
    
    try {
      const stats = await fs.stat(fullPath);
      if (!stats.isFile()) {
        return res.status(404).json({ error: 'File not found' });
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      throw error;
    }

    // Set appropriate headers
    res.setHeader('Cache-Control', 'private, max-age=3600'); // 1 hour cache
    res.sendFile(fullPath);

  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({
      error: 'Internal server error serving file'
    });
  }
});

export default router;