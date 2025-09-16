import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Edit, Download, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Contract {
  id: string;
  tenant_application_id: string;
  contract_number: string;
  tenant_name: string;
  sector: string;
  contract_type: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  status: string;
  terms: string;
  special_conditions: string;
  created_at: string;
  updated_at: string;
}

const ContractsModule: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState({
    tenant_application_id: '',
    contract_type: 'lease',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    security_deposit: '',
    terms: '',
    special_conditions: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load approved applications for contract creation
      const { data: appsData, error: appsError } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('status', 'approved');

      if (appsError) throw appsError;
      setApplications(appsData || []);

      // Note: In a real implementation, you would have a contracts table
      // For now, we'll create mock data based on approved applications
      const mockContracts: Contract[] = (appsData || []).slice(0, 3).map((app, index) => ({
        id: `contract-${app.id}`,
        tenant_application_id: app.id,
        contract_number: `ODE-${new Date().getFullYear()}-${String(index + 1).padStart(3, '0')}`,
        tenant_name: app.company_name,
        sector: app.preferred_sector,
        contract_type: 'lease',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        monthly_rent: 2500 + (index * 500),
        security_deposit: 5000 + (index * 1000),
        status: ['active', 'pending', 'expired'][index % 3],
        terms: 'Standard lease agreement terms and conditions...',
        special_conditions: 'Special conditions as agreed upon...',
        created_at: app.created_at,
        updated_at: app.updated_at
      }));

      setContracts(mockContracts);

    } catch (error: any) {
      console.error('Error loading contracts:', error);
      toast({
        title: "Error",
        description: "Failed to load contracts data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const number = String(contracts.length + 1).padStart(3, '0');
    return `ODE-${year}-${number}`;
  };

  const handleCreateContract = async () => {
    try {
      if (!formData.tenant_application_id || !formData.start_date || !formData.end_date) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const selectedApp = applications.find(app => app.id === formData.tenant_application_id);
      if (!selectedApp) return;

      const newContract: Contract = {
        id: `contract-${Date.now()}`,
        tenant_application_id: formData.tenant_application_id,
        contract_number: generateContractNumber(),
        tenant_name: selectedApp.company_name,
        sector: selectedApp.preferred_sector,
        contract_type: formData.contract_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        monthly_rent: parseInt(formData.monthly_rent) || 0,
        security_deposit: parseInt(formData.security_deposit) || 0,
        status: 'pending',
        terms: formData.terms,
        special_conditions: formData.special_conditions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setContracts([...contracts, newContract]);
      setIsCreateModalOpen(false);
      resetForm();

      toast({
        title: "Success",
        description: "Contract created successfully",
      });

    } catch (error: any) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive",
      });
    }
  };

  const handleUpdateContract = async () => {
    try {
      if (!editingContract) return;

      const updatedContract = {
        ...editingContract,
        contract_type: formData.contract_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        monthly_rent: parseInt(formData.monthly_rent) || 0,
        security_deposit: parseInt(formData.security_deposit) || 0,
        terms: formData.terms,
        special_conditions: formData.special_conditions,
        updated_at: new Date().toISOString()
      };

      setContracts(contracts.map(c => c.id === editingContract.id ? updatedContract : c));
      setEditingContract(null);
      resetForm();

      toast({
        title: "Success",
        description: "Contract updated successfully",
      });

    } catch (error: any) {
      console.error('Error updating contract:', error);
      toast({
        title: "Error",
        description: "Failed to update contract",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      tenant_application_id: '',
      contract_type: 'lease',
      start_date: '',
      end_date: '',
      monthly_rent: '',
      security_deposit: '',
      terms: '',
      special_conditions: ''
    });
  };

  const openEditModal = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      tenant_application_id: contract.tenant_application_id,
      contract_type: contract.contract_type,
      start_date: contract.start_date,
      end_date: contract.end_date,
      monthly_rent: contract.monthly_rent.toString(),
      security_deposit: contract.security_deposit.toString(),
      terms: contract.terms,
      special_conditions: contract.special_conditions
    });
  };

  const generateContractDocument = (contract: Contract) => {
    const docContent = `
CONTRACT AGREEMENT
Contract Number: ${contract.contract_number}

PARTIES:
Landlord: ODE Food Hall
Tenant: ${contract.tenant_name}

PROPERTY DETAILS:
Sector: ${contract.sector}
Contract Type: ${contract.contract_type}

TERMS:
Start Date: ${contract.start_date}
End Date: ${contract.end_date}
Monthly Rent: $${contract.monthly_rent}
Security Deposit: $${contract.security_deposit}

TERMS AND CONDITIONS:
${contract.terms}

SPECIAL CONDITIONS:
${contract.special_conditions}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([docContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-${contract.contract_number}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Contract document downloaded",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Contracts Management</h2>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contracts Management</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>
                Create a new contract for an approved tenant application
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant_application_id">Tenant Application</Label>
                  <Select value={formData.tenant_application_id} onValueChange={(value) => setFormData({...formData, tenant_application_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approved application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.company_name} - {app.preferred_sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_type">Contract Type</Label>
                  <Select value={formData.contract_type} onValueChange={(value) => setFormData({...formData, contract_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lease">Lease Agreement</SelectItem>
                      <SelectItem value="license">License Agreement</SelectItem>
                      <SelectItem value="concession">Concession Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                  <Input
                    id="monthly_rent"
                    type="number"
                    value={formData.monthly_rent}
                    onChange={(e) => setFormData({...formData, monthly_rent: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="security_deposit">Security Deposit ($)</Label>
                  <Input
                    id="security_deposit"
                    type="number"
                    value={formData.security_deposit}
                    onChange={(e) => setFormData({...formData, security_deposit: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="Standard lease terms..."
                  value={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="special_conditions">Special Conditions</Label>
                <Textarea
                  id="special_conditions"
                  placeholder="Any special conditions..."
                  value={formData.special_conditions}
                  onChange={(e) => setFormData({...formData, special_conditions: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateContract}>Create Contract</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contracts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {contracts.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.monthly_rent, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {contracts.filter(c => c.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
          <CardDescription>Manage tenant contracts and agreements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract #</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contract_number}</TableCell>
                  <TableCell>{contract.tenant_name}</TableCell>
                  <TableCell>{contract.sector}</TableCell>
                  <TableCell className="capitalize">{contract.contract_type}</TableCell>
                  <TableCell>
                    {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${contract.monthly_rent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(contract)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateContractDocument(contract)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Contract Modal */}
      <Dialog open={!!editingContract} onOpenChange={() => setEditingContract(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>
              Update contract details and terms
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_contract_type">Contract Type</Label>
                <Select value={formData.contract_type} onValueChange={(value) => setFormData({...formData, contract_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lease">Lease Agreement</SelectItem>
                    <SelectItem value="license">License Agreement</SelectItem>
                    <SelectItem value="concession">Concession Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_start_date">Start Date</Label>
                <Input
                  id="edit_start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_end_date">End Date</Label>
                <Input
                  id="edit_end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_monthly_rent">Monthly Rent ($)</Label>
                <Input
                  id="edit_monthly_rent"
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({...formData, monthly_rent: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_security_deposit">Security Deposit ($)</Label>
                <Input
                  id="edit_security_deposit"
                  type="number"
                  value={formData.security_deposit}
                  onChange={(e) => setFormData({...formData, security_deposit: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_terms">Terms and Conditions</Label>
              <Textarea
                id="edit_terms"
                value={formData.terms}
                onChange={(e) => setFormData({...formData, terms: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_special_conditions">Special Conditions</Label>
              <Textarea
                id="edit_special_conditions"
                value={formData.special_conditions}
                onChange={(e) => setFormData({...formData, special_conditions: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingContract(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateContract}>Update Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractsModule;