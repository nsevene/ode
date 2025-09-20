// Secure Storage API for file upload and management
// Uses JWT authentication instead of client-trusted userEmail

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
  original_name?: string;
  size?: number;
  mime_type?: string;
}

export class SecureStorageAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/storage') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authorization headers with JWT token
   */
  private getAuthHeaders(): HeadersInit {
    const token = this.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  /**
   * Get access token from auth store or localStorage
   */
  private getAccessToken(): string | null {
    // Try to get from auth store if available
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          return parsed.state?.accessToken || null;
        } catch (e) {
          console.warn('Failed to parse auth data from localStorage');
        }
      }
    }
    return null;
  }

  /**
   * Get all available storage buckets
   */
  async getBuckets(): Promise<StorageBucket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/buckets`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch buckets');
      }
      
      const result = await response.json();
      return result.buckets || [];
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
    mimeType: string
  ): Promise<FileValidationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/validate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          bucket_name: bucketName,
          filename,
          file_size: fileSize,
          mime_type: mimeType
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_message || 'Validation failed');
      }
      
      return await response.json();
    } catch (error) {
      return {
        valid: false,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Upload file to storage bucket (JWT secured)
   */
  async uploadFile(
    bucketName: string,
    file: File,
    entityId?: string,
    entityType?: string
  ): Promise<FileUploadResult> {
    try {
      // First validate the file
      const validation = await this.validateFile(
        bucketName,
        file.name,
        file.size,
        file.type
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
      if (entityId) formData.append('entity_id', entityId);
      if (entityType) formData.append('entity_type', entityType);

      const token = this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Delete file from storage (JWT secured)
   */
  async deleteFile(
    filePath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/delete`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          file_path: filePath
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  /**
   * Get signed URL for private file access (JWT secured)
   */
  async getSignedUrl(
    filePath: string,
    expiresIn: number = 3600 // 1 hour default
  ): Promise<{ url?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/signed-url`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          file_path: filePath,
          expires_in: expiresIn,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate signed URL');
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

  /**
   * Helper to check if user can upload to bucket based on current auth state
   */
  async canUploadToBucket(bucketName: string): Promise<boolean> {
    try {
      const buckets = await this.getBuckets();
      const bucket = buckets.find(b => b.id === bucketName);
      return !!bucket; // If we can see the bucket, we can likely upload to it
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance with new secure API
export const storageAPI = new SecureStorageAPI();

// Export secure helper functions (NO MORE userEmail parameter!)
export const uploadToDocuments = (file: File, entityId?: string) =>
  storageAPI.uploadFile('documents', file, entityId);

export const uploadPresentation = (file: File, applicationId?: string) =>
  storageAPI.uploadFile('presentations', file, applicationId, 'application');

export const uploadPropertyImage = (file: File, propertyId?: string) =>
  storageAPI.uploadFile('images', file, propertyId, 'property');

export const uploadInvestmentReport = (file: File, investmentId?: string) =>
  storageAPI.uploadFile('reports', file, investmentId, 'investment');

export const uploadApplicationDocument = (file: File, applicationId?: string) =>
  storageAPI.uploadFile('applications', file, applicationId, 'application');

// Export types for external use
export type { StorageBucket, FileValidationResult, FileUploadResult };