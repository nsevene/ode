import { supabase } from '../supabase'

// Types for investor operations
export interface InvestorPortfolio {
  id: string
  investor_id: string
  total_value: number
  total_invested: number
  total_return: number
  return_percentage: number
  last_updated: string
}

export interface InvestorInvestment {
  id: string
  investor_id: string
  property_id: string
  amount: number
  percentage: number
  status: 'active' | 'pending' | 'completed' | 'cancelled'
  created_at: string
  property?: {
    name: string
    address: string
    type: string
    status: string
  }
}

export interface InvestmentCommitment {
  id: string
  propertyId: string
  propertyName: string
  propertyAddress: string
  investmentType: 'equity' | 'debt' | 'hybrid'
  amount: number
  expectedReturn: number
  minimumInvestment: number
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'on_hold'
  description?: string
  documents: string[]
  milestones: string[]
  paymentSchedule: string[]
  createdAt: string
  updatedAt: string
}

export interface DocumentSigning {
  id: string
  documentName: string
  documentType: 'contract' | 'agreement' | 'disclosure' | 'legal'
  status: 'pending' | 'signed' | 'expired' | 'draft'
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  description?: string
  requirements: string[]
  documents: string[]
  propertyName?: string
  signedAt?: string
  createdAt: string
  updatedAt: string
}

export interface InvestorTransaction {
  id: string
  investor_id: string
  type: 'buy' | 'sell' | 'dividend' | 'fee'
  amount: number
  asset: string
  date: string
  description: string
  status: 'completed' | 'pending' | 'failed'
}

export interface MarketData {
  property_id: string
  name: string
  current_value: number
  price_change: number
  price_change_percent: number
  market_cap: number
  volume: number
  last_updated: string
}

export interface InvestorDocument {
  id: string
  investor_id: string
  name: string
  type: 'contract' | 'report' | 'certificate' | 'other'
  url: string
  uploaded_at: string
  is_public: boolean
}

export interface InvestmentOpportunity {
  id: string
  title: string
  description: string
  type: 'commercial' | 'retail' | 'warehouse' | 'residential'
  status: 'active' | 'funding' | 'completed' | 'cancelled'
  location: string
  totalInvestment: number
  minInvestment: number
  expectedReturn: number
  investmentPeriod: number
  riskLevel: 'low' | 'medium' | 'high'
  images: string[]
  features: string[]
  documents: string[]
  created_at: string
  updated_at: string
}

export interface MarketAnalysis {
  totalOpportunities: number
  averageReturn: number
  totalInvestment: number
  riskDistribution: {
    low: number
    medium: number
    high: number
  }
  typeDistribution: {
    commercial: number
    retail: number
    warehouse: number
    residential: number
  }
}

export interface KYCStatus {
  id: string
  investor_id: string
  status: 'pending' | 'approved' | 'rejected' | 'not_started'
  documents: string[]
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  notes?: string
  requirements: string[]
}

// Investor API functions
export const investorApi = {
  // Portfolio management
  async getPortfolio(investorId: string): Promise<InvestorPortfolio | null> {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('investor_id', investorId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updatePortfolio(investorId: string, updates: Partial<InvestorPortfolio>): Promise<InvestorPortfolio> {
    const { data, error } = await supabase
      .from('portfolios')
      .upsert({
        investor_id: investorId,
        ...updates,
        last_updated: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Investments management
  async getInvestments(investorId: string): Promise<InvestorInvestment[]> {
    const { data, error } = await supabase
      .from('investments')
      .select(`
        *,
        properties (
          name,
          address,
          type,
          status
        )
      `)
      .eq('investor_id', investorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createInvestment(investment: Omit<InvestorInvestment, 'id' | 'created_at'>): Promise<InvestorInvestment> {
    const { data, error } = await supabase
      .from('investments')
      .insert(investment)
      .select(`
        *,
        properties (
          name,
          address,
          type,
          status
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateInvestmentStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('investments')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  },

  // Transactions management
  async getTransactions(investorId: string): Promise<InvestorTransaction[]> {
    const { data, error } = await supabase
      .from('investor_transactions')
      .select('*')
      .eq('investor_id', investorId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createTransaction(transaction: Omit<InvestorTransaction, 'id'>): Promise<InvestorTransaction> {
    const { data, error } = await supabase
      .from('investor_transactions')
      .insert(transaction)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Market data
  async getMarketData(): Promise<MarketData[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id,
        name,
        current_value,
        price_change,
        price_change_percent,
        market_cap,
        volume,
        last_updated
      `)
      .eq('status', 'available')
      .order('market_cap', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getPropertyDetails(propertyId: string): Promise<any> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        investments (
          investor_id,
          amount,
          percentage,
          status
        )
      `)
      .eq('id', propertyId)
      .single()

    if (error) throw error
    return data
  },

  // Documents management
  async getDocuments(investorId: string): Promise<InvestorDocument[]> {
    const { data, error } = await supabase
      .from('investor_documents')
      .select('*')
      .eq('investor_id', investorId)
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async uploadDocument(investorId: string, file: File, metadata: Omit<InvestorDocument, 'id' | 'url' | 'uploaded_at'>): Promise<InvestorDocument> {
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `investor-documents/${investorId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('investor-documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('investor-documents')
      .getPublicUrl(filePath)

    // Save document metadata to database
    const { data, error } = await supabase
      .from('investor_documents')
      .insert({
        investor_id,
        ...metadata,
        url: urlData.publicUrl,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Analytics and performance
  async getPortfolioPerformance(investorId: string, period: '1M' | '3M' | '6M' | '1Y' | 'ALL' = 'ALL'): Promise<{
    totalReturn: number
    returnPercentage: number
    bestPerformer: string
    worstPerformer: string
    riskScore: number
    sharpeRatio: number
  }> {
    const { data, error } = await supabase
      .from('investor_transactions')
      .select('*')
      .eq('investor_id', investorId)
      .eq('status', 'completed')

    if (error) throw error

    // Calculate performance metrics
    const transactions = data || []
    const totalReturn = transactions.reduce((sum, t) => {
      return t.type === 'buy' ? sum - t.amount : sum + t.amount
    }, 0)

    const portfolio = await this.getPortfolio(investorId)
    const returnPercentage = portfolio ? (totalReturn / portfolio.total_invested) * 100 : 0

    return {
      totalReturn,
      returnPercentage,
      bestPerformer: 'Property A', // Mock data
      worstPerformer: 'Property B', // Mock data
      riskScore: 0.7, // Mock data
      sharpeRatio: 1.2 // Mock data
    }
  },

  // KYC and compliance
  async getKYCStatus(investorId: string): Promise<{
    status: 'pending' | 'approved' | 'rejected' | 'not_started'
    documents: string[]
    last_updated: string
  }> {
    const { data, error } = await supabase
      .from('kyc_status')
      .select('*')
      .eq('investor_id', investorId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    
    return data || {
      status: 'not_started',
      documents: [],
      last_updated: new Date().toISOString()
    }
  },

  async updateKYCStatus(investorId: string, status: string, documents: string[]): Promise<void> {
    const { error } = await supabase
      .from('kyc_status')
      .upsert({
        investor_id: investorId,
        status,
        documents,
        last_updated: new Date().toISOString()
      })

    if (error) throw error
  },

  // Marketplace functions
  async getInvestmentOpportunities(): Promise<InvestmentOpportunity[]> {
    try {
      const { data, error } = await supabase
        .from('investment_opportunities')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching investment opportunities:', error)
      throw error
    }
  },

  async getOpportunityById(id: string): Promise<InvestmentOpportunity | null> {
    try {
      const { data, error } = await supabase
        .from('investment_opportunities')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching opportunity:', error)
      throw error
    }
  },

  async addToFavorites(opportunityId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('investor_favorites')
        .insert({
          investor_id: userId,
          opportunity_id: opportunityId
        })

      if (error) throw error
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  },

  async removeFromFavorites(opportunityId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('investor_favorites')
        .delete()
        .eq('investor_id', userId)
        .eq('opportunity_id', opportunityId)

      if (error) throw error
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  },

  async getFavorites(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('investor_favorites')
        .select('opportunity_id')
        .eq('investor_id', userId)

      if (error) throw error
      return data?.map(item => item.opportunity_id) || []
    } catch (error) {
      console.error('Error fetching favorites:', error)
      throw error
    }
  },

  async submitInvestmentInterest(opportunityId: string, userId: string, amount: number, message?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('investment_interests')
        .insert({
          investor_id: userId,
          opportunity_id: opportunityId,
          amount,
          message,
          status: 'pending'
        })

      if (error) throw error
    } catch (error) {
      console.error('Error submitting investment interest:', error)
      throw error
    }
  },

  async getMarketAnalysis(): Promise<MarketAnalysis> {
    try {
      const { data, error } = await supabase
        .from('investment_opportunities')
        .select('*')

      if (error) throw error

      const opportunities = data || []
      const totalOpportunities = opportunities.length
      const averageReturn = opportunities.reduce((sum, opp) => sum + opp.expectedReturn, 0) / totalOpportunities
      const totalInvestment = opportunities.reduce((sum, opp) => sum + opp.totalInvestment, 0)

      const riskDistribution = opportunities.reduce((acc, opp) => {
        acc[opp.riskLevel] = (acc[opp.riskLevel] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const typeDistribution = opportunities.reduce((acc, opp) => {
        acc[opp.type] = (acc[opp.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        totalOpportunities,
        averageReturn,
        totalInvestment,
        riskDistribution: {
          low: riskDistribution.low || 0,
          medium: riskDistribution.medium || 0,
          high: riskDistribution.high || 0
        },
        typeDistribution: {
          commercial: typeDistribution.commercial || 0,
          retail: typeDistribution.retail || 0,
          warehouse: typeDistribution.warehouse || 0,
          residential: typeDistribution.residential || 0
        }
      }
    } catch (error) {
      console.error('Error fetching market analysis:', error)
      throw error
    }
  },

  // KYC Management
  async getKYCStatus(): Promise<KYCStatus | null> {
    try {
      const { data, error } = await supabase
        .from('kyc_status')
        .select('*')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching KYC status:', error)
      throw error
    }
  },

  async submitKYC(): Promise<void> {
    try {
      const { error } = await supabase
        .from('kyc_status')
        .update({
          status: 'pending',
          submitted_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Error submitting KYC:', error)
      throw error
    }
  },

  async uploadKYCDocument(file: File, type: string): Promise<string> {
    try {
      const fileName = `kyc_${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName)

      // Update KYC status with new document
      const { error: updateError } = await supabase
        .from('kyc_status')
        .update({
          documents: [publicUrl]
        })

      if (updateError) throw updateError

      return publicUrl
    } catch (error) {
      console.error('Error uploading KYC document:', error)
      throw error
    }
  },

  async deleteKYCDocument(documentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('kyc_documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting KYC document:', error)
      throw error
    }
  },

  async getKYCDocuments(): Promise<Array<{
    id: string
    name: string
    type: string
    status: 'pending' | 'approved' | 'rejected'
    uploaded_at: string
    url: string
  }>> {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching KYC documents:', error)
      throw error
    }
  },

  // Investment Commitments Management
  async getInvestmentCommitments(): Promise<InvestmentCommitment[]> {
    try {
      const { data, error } = await supabase
        .from('investment_commitments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching investment commitments:', error)
      throw error
    }
  },

  async getInvestmentCommitmentById(id: string): Promise<InvestmentCommitment> {
    try {
      const { data, error } = await supabase
        .from('investment_commitments')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching investment commitment:', error)
      throw error
    }
  },

  async createInvestmentCommitment(commitment: Partial<InvestmentCommitment>): Promise<InvestmentCommitment> {
    try {
      const { data, error } = await supabase
        .from('investment_commitments')
        .insert([commitment])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating investment commitment:', error)
      throw error
    }
  },

  async updateInvestmentCommitment(id: string, commitment: Partial<InvestmentCommitment>): Promise<void> {
    try {
      const { error } = await supabase
        .from('investment_commitments')
        .update(commitment)
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating investment commitment:', error)
      throw error
    }
  },

  async deleteInvestmentCommitment(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('investment_commitments')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting investment commitment:', error)
      throw error
    }
  },

  async updateCommitmentStatus(id: string, status: InvestmentCommitment['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('investment_commitments')
        .update({ status })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating commitment status:', error)
      throw error
    }
  },

  async uploadCommitmentDocuments(id: string, files: File[]): Promise<void> {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${id}_${Date.now()}.${fileExt}`
        const filePath = `commitments/${id}/${fileName}`

        const { error } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (error) throw error
        return filePath
      })

      const filePaths = await Promise.all(uploadPromises)
      
      const { error } = await supabase
        .from('investment_commitments')
        .update({ documents: filePaths })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error uploading commitment documents:', error)
      throw error
    }
  },

  // Document Signing Management
  async getDocumentSignings(): Promise<DocumentSigning[]> {
    try {
      const { data, error } = await supabase
        .from('document_signings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching document signings:', error)
      throw error
    }
  },

  async getDocumentSigningById(id: string): Promise<DocumentSigning> {
    try {
      const { data, error } = await supabase
        .from('document_signings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching document signing:', error)
      throw error
    }
  },

  async downloadDocument(id: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('document_signings')
        .select('documents')
        .eq('id', id)
        .single()

      if (error) throw error

      if (data.documents && data.documents.length > 0) {
        const documentUrl = data.documents[0]
        const link = document.createElement('a')
        link.href = documentUrl
        link.download = documentUrl.split('/').pop() || 'document'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      throw error
    }
  },

  async signDocumentWithText(id: string, signature: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('document_signings')
        .update({ 
          status: 'signed',
          signedAt: new Date().toISOString(),
          signature: signature
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error signing document with text:', error)
      throw error
    }
  },

  async signDocumentWithFile(id: string, signatureFile: File): Promise<void> {
    try {
      const fileExt = signatureFile.name.split('.').pop()
      const fileName = `${id}_signature_${Date.now()}.${fileExt}`
      const filePath = `signatures/${id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, signatureFile)

      if (uploadError) throw uploadError

      const { error } = await supabase
        .from('document_signings')
        .update({ 
          status: 'signed',
          signedAt: new Date().toISOString(),
          signature: filePath
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error signing document with file:', error)
      throw error
    }
  }
}
