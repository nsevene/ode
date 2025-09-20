// Экспорт типов из store для использования в других частях приложения
export type { 
  PortfolioData, 
  FinancialMetrics, 
  DashboardData 
} from '../store/investorStore'

// Дополнительные типы для инвесторского раздела
export interface InvestmentOpportunity {
  id: string
  title: string
  description: string
  type: 'real_estate' | 'stocks' | 'bonds' | 'funds'
  expectedReturn: number
  riskLevel: 'low' | 'medium' | 'high'
  minimumInvestment: number
  duration: string
  location?: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
}

export interface MarketAnalysis {
  id: string
  title: string
  summary: string
  sector: string
  trend: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  keyMetrics: {
    name: string
    value: number
    change: number
    changePercent: number
  }[]
  recommendations: string[]
  publishedAt: string
}

export interface InvestorProfile {
  id: string
  email: string
  name: string
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  investmentGoals: string[]
  preferredSectors: string[]
  minimumInvestment: number
  maximumInvestment: number
  investmentHorizon: 'short' | 'medium' | 'long'
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'dividend' | 'interest' | 'fee'
  assetId: string
  assetName: string
  amount: number
  price: number
  totalValue: number
  date: string
  status: 'pending' | 'completed' | 'cancelled'
  fees?: number
  notes?: string
}

export interface Alert {
  id: string
  type: 'price' | 'news' | 'market' | 'portfolio'
  title: string
  message: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  actionUrl?: string
}