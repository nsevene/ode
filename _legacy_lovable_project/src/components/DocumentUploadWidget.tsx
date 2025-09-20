import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Upload, CheckCircle } from 'lucide-react';

interface DocumentUploadWidgetProps {
  bucket?: string;
  onUploadSuccess?: (filePath: string) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  showQuickUpload?: boolean;
}

const DOCUMENT_TYPES = [
  { value: 'contract', label: 'Contract' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'report', label: 'Report' },
  { value: 'legal', label: 'Legal' },
  { value: 'financial', label: 'Financial' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'other', label: 'Other' },
];

const STORAGE_BUCKETS = [
  { id: 'contracts', name: 'Contracts' },
  { id: 'admin-documents', name: 'Admin Documents' },
  { id: 'vendor-documents', name: 'Vendor Documents' },
];

const DocumentUploadWidget: React.FC<DocumentUploadWidgetProps> = ({
  bucket = 'admin-documents',
  onUploadSuccess,
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'],
  maxSizeMB = 50,
  showQuickUpload = true,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    bucket: bucket,
    document_type: 'other',
    description: '',
    tags: '',
    file: null as File | null,
  });

  // Handle file upload
  const handleFileUpload = async () => {
    if (!formData.file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    // Check file size
    if (formData.file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'Error',
        description: `File size exceeds ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${formData.file.name}`;
      const filePath = `${formData.bucket}/${fileName}`;

      // Upload file to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(formData.bucket)
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Save metadata
      const { error: metadataError } = await supabase
        .from('document_metadata')
        .insert({
          file_path: uploadData.path,
          bucket_name: formData.bucket,
          original_name: formData.file.name,
          file_size: formData.file.size,
          mime_type: formData.file.type,
          document_type: formData.document_type,
          description: formData.description || null,
          tags: formData.tags
            ? formData.tags.split(',').map((t) => t.trim())
            : [],
        });

      if (metadataError) throw metadataError;

      toast({
        title: 'Success',
        description: 'Document uploaded',
      });

      // Reset form
      setFormData({
        bucket: bucket,
        document_type: 'other',
        description: '',
        tags: '',
        file: null,
      });

      setIsOpen(false);
      onUploadSuccess?.(uploadData.path);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, file: e.dataTransfer.files[0] });
    }
  };

  // Quick upload without modal
  const QuickUpload = () => (
    <Card className="border-dashed border-2 hover:border-primary transition-colors">
      <CardContent className="p-6">
        <div
          className={`text-center cursor-pointer ${dragActive ? 'bg-primary/5' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quick Upload</h3>
          <p className="text-muted-foreground mb-4">
            Drag file here or click to select
          </p>
          <Input
            type="file"
            accept={allowedTypes.join(',')}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({ ...formData, file });
                setIsOpen(true);
              }
            }}
            className="hidden"
            id="quick-upload"
          />
          <Label htmlFor="quick-upload" className="cursor-pointer">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {showQuickUpload && <QuickUpload />}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {!showQuickUpload && (
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Document
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Storage selection */}
            <div>
              <Label htmlFor="bucket">Storage Location</Label>
              <Select
                value={formData.bucket}
                onValueChange={(value) =>
                  setFormData({ ...formData, bucket: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STORAGE_BUCKETS.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.id}>
                      {bucket.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document type */}
            <div>
              <Label htmlFor="type">Document Type</Label>
              <Select
                value={formData.document_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, document_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File */}
            <div>
              <Label htmlFor="file">File</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept={allowedTypes.join(',')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      file: e.target.files?.[0] || null,
                    })
                  }
                />
                {formData.file && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {formData.file.name} (
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                placeholder="Brief document description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                placeholder="contract, 2024, important"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>

            {/* Upload button */}
            <Button
              onClick={handleFileUpload}
              disabled={uploading || !formData.file}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentUploadWidget;
