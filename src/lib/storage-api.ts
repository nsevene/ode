// Storage API for file upload and management
// Compatible with PostgreSQL backend

export interface StorageBucket {
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

export interface FilePermission {
  id: string;
  file_path: string;
  bucket_name: string;
  user_id?: string;
  user_role?: string;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  can_share: boolean;
  expires_at?: string;
}

export interface FileValidationResult {
  valid: boolean;
  error_message: string;
  file_path?: string;
}

export interface FileUploadResult {
  success: boolean;
  file_path?: string;
  file_url?: string;
  error?: string;
}

export class StorageAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/storage') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all available storage buckets
   */
  async getBuckets(): Promise<StorageBucket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/buckets`);
      if (!response.ok) throw new Error('Failed to fetch buckets');
      return await response.json();
    } catch (error) {
      console.error('Error fetching buckets:', error);
      return [];
    }
  }

  /**
   * Validate file before upload
   */
  async validateFile(
    bucketName: string,
    filename: string,
    fileSize: number,
    mimeType: string,
    userEmail: string
  ): Promise<FileValidationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucket_name: bucketName,
          filename,
          file_size: fileSize,
          mime_type: mimeType,
          user_email: userEmail,
        }),
      });

      if (!response.ok) throw new Error('Validation failed');
      return await response.json();
    } catch (error) {
      return {
        valid: false,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Upload file to storage bucket
   */
  async uploadFile(
    bucketName: string,
    file: File,
    userEmail: string,
    entityId?: string,
    entityType?: string
  ): Promise<FileUploadResult> {
    try {
      // First validate the file
      const validation = await this.validateFile(
        bucketName,
        file.name,
        file.size,
        file.type,
        userEmail
      );

      if (!validation.valid) {
        return {
          success: false,
          error: validation.error_message,
        };
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket_name', bucketName);
      formData.append('user_email', userEmail);
      if (entityId) formData.append('entity_id', entityId);
      if (entityType) formData.append('entity_type', entityType);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();
      return {
        success: true,
        file_path: result.file_path,
        file_url: result.file_url,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(
    filePath: string,
    userEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_path: filePath,
          user_email: userEmail,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(
    filePath: string,
    userEmail: string,
    expiresIn: number = 3600 // 1 hour default
  ): Promise<{ url?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_path: filePath,
          user_email: userEmail,
          expires_in: expiresIn,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();
      return { url: result.signed_url };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to generate signed URL',
      };
    }
  }

  /**
   * Get file metadata
   */
  async getFileInfo(filePath: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/info?path=${encodeURIComponent(filePath)}`);
      if (!response.ok) throw new Error('File not found');
      return await response.json();
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }

  /**
   * Helper method to format file size
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Helper method to get file icon based on MIME type
   */
  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel')) return '📊';
    if (mimeType.includes('powerpoint')) return '📽️';
    return '📎';
  }
}

// Export singleton instance
export const storageAPI = new StorageAPI();

// Export helper functions
export const uploadToDocuments = (file: File, userEmail: string, entityId?: string) =>
  storageAPI.uploadFile('documents', file, userEmail, entityId);

export const uploadPresentation = (file: File, userEmail: string, applicationId?: string) =>
  storageAPI.uploadFile('presentations', file, userEmail, applicationId, 'application');

export const uploadPropertyImage = (file: File, userEmail: string, propertyId?: string) =>
  storageAPI.uploadFile('images', file, userEmail, propertyId, 'property');

export const uploadInvestmentReport = (file: File, userEmail: string, investmentId?: string) =>
  storageAPI.uploadFile('reports', file, userEmail, investmentId, 'investment');