import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRoles } from '@/hooks/useRoles';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  TrendingUp, 
  Presentation, 
  Shield, 
  Newspaper,
  Download,
  Lock,
  Eye,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentItem {
  name: string;
  path: string;
  bucket: string;
  size?: number;
  lastModified?: string;
  description?: string;
  type: 'pdf' | 'excel' | 'powerpoint' | 'image' | 'document';
}

const DataRoom: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const { userRole, isAdmin } = useRoles();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(section || 'contracts');
  const [documents, setDocuments] = useState<Record<string, DocumentItem[]>>({});
  const [loading, setLoading] = useState(true);

  const sections = {
    contracts: {
      title: 'Contracts',
      icon: FileText,
      bucket: 'data-room-contracts',
      description: 'Legal agreements, lease contracts, and vendor agreements',
      accessible: ['investor', 'admin']
    },
    financials: {
      title: 'Financials',
      icon: TrendingUp,
      bucket: 'data-room-financials',
      description: 'Financial statements, projections, and investment data',
      accessible: ['investor', 'admin']
    },
    decks: {
      title: 'Presentation Decks',
      icon: Presentation,
      bucket: 'data-room-decks',
      description: 'Investor presentations and pitch decks',
      accessible: ['investor', 'admin']
    },
    policies: {
      title: 'Policies',
      icon: Shield,
      bucket: 'data-room-policies',
      description: 'Internal policies and procedures (Internal Only)',
      accessible: ['admin']
    },
    press: {
      title: 'Press & Media',
      icon: Newspaper,
      bucket: 'data-room-press',
      description: 'Press releases, media coverage, and marketing materials',
      accessible: ['investor', 'admin']
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    const docsData: Record<string, DocumentItem[]> = {};

    try {
      for (const [key, sectionData] of Object.entries(sections)) {
        if (!sectionData.accessible.includes(userRole || '')) {
          continue;
        }

        const { data: files, error } = await supabase.storage
          .from(sectionData.bucket)
          .list('', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (error) {
          console.error(`Error fetching documents for ${key}:`, error);
          continue;
        }

        docsData[key] = files?.map(file => ({
          name: file.name,
          path: file.name,
          bucket: sectionData.bucket,
          size: file.metadata?.size,
          lastModified: file.created_at,
          type: getFileType(file.name)
        })) || [];
      }

      setDocuments(docsData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (filename: string): DocumentItem['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'xls': case 'xlsx': return 'excel';
      case 'ppt': case 'pptx': return 'powerpoint';
      case 'jpg': case 'jpeg': case 'png': case 'webp': return 'image';
      default: return 'document';
    }
  };

  const getFileIcon = (type: DocumentItem['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'excel': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'powerpoint': return <Presentation className="w-4 h-4 text-orange-500" />;
      case 'image': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const downloadDocument = async (doc: DocumentItem) => {
    try {
      const { data, error } = await supabase.storage
        .from(doc.bucket)
        .download(doc.path);

      if (error) {
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `${doc.name} is being downloaded.`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Unable to download the document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  const accessibleSections = Object.entries(sections).filter(([_, sectionData]) =>
    sectionData.accessible.includes(userRole || '')
  );

  if (!userRole || !['investor', 'admin'].includes(userRole)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-8">
                <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
                <p className="text-muted-foreground">
                  The Data Room is only accessible to investors and internal team members.
                  Please contact your administrator if you believe you should have access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">ODE Data Room</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Secure access to important documents, financial information, and legal materials.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline">Role: {userRole}</Badge>
              <Badge variant="secondary">Secure Access</Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
              {accessibleSections.map(([key, section]) => {
                const IconComponent = section.icon;
                return (
                  <TabsTrigger key={key} value={key} className="flex flex-col gap-1 p-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs">{section.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {accessibleSections.map(([key, section]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <section.icon className="w-5 h-5" />
                      {section.title}
                      {key === 'policies' && <Badge variant="destructive">Internal Only</Badge>}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading documents...</p>
                      </div>
                    ) : documents[key]?.length > 0 ? (
                      <div className="space-y-3">
                        {documents[key].map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.type)}
                              <div>
                                <h4 className="font-medium">{doc.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{formatFileSize(doc.size)}</span>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(doc.lastModified)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadDocument(doc)}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">No documents available</h3>
                        <p className="text-muted-foreground">
                          Documents will appear here once they are uploaded by the internal team.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Security Notice */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Security & Confidentiality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All documents in this data room are confidential and proprietary. Access is logged 
                and monitored. By downloading or viewing these documents, you agree to maintain 
                their confidentiality and use them solely for legitimate business purposes related 
                to your involvement with ODE Food Hall.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataRoom;