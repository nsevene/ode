import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Типы данных для инвесторского раздела
export interface PortfolioData {
  id: string
  name: string
  value: number
  change: number
  changePercent: number
  category: 'real_estate' | 'stocks' | 'bonds' | 'crypto'
  lastUpdated: string
}

export interface FinancialMetrics {
  totalPortfolioValue: number
  totalReturn: number
  totalReturnPercent: number
  monthlyReturn: number
  monthlyReturnPercent: number
  riskScore: number
  diversificationScore: number
}

export interface DashboardData {
  portfolio: PortfolioData[]
  metrics: FinancialMetrics
  recentTransactions: {
    id: string
    type: 'buy' | 'sell' | 'dividend'
    asset: string
    amount: number
    date: string
  }[]
  marketTrends: {
    date: string
    value: number
  }[]
}

interface InvestorStoreState {
  // Состояние данных
  dashboardData: DashboardData | null
  isLoading: boolean
  error: string | null
  
  // Действия
  fetchDashboardData: () => Promise<void>
  updatePortfolio: (portfolio: PortfolioData[]) => void
  clearError: () => void
}

export const useInvestorStore = create<InvestorStoreState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      dashboardData: null,
      isLoading: false,
      error: null,

      // Загрузка данных дашборда
      fetchDashboardData: async () => {
        set({ isLoading: true, error: null })
        
        try {
          // Имитация API запроса
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock данные
          const mockData: DashboardData = {
            portfolio: [
              {
                id: '1',
                name: 'Коммерческая недвижимость - Офисный центр',
                value: 2500000,
                change: 125000,
                changePercent: 5.26,
                category: 'real_estate',
                lastUpdated: new Date().toISOString()
              },
              {
                id: '2',
                name: 'Акции технологических компаний',
                value: 850000,
                change: -15000,
                changePercent: -1.73,
                category: 'stocks',
                lastUpdated: new Date().toISOString()
              },
              {
                id: '3',
                name: 'Государственные облигации',
                value: 500000,
                change: 2500,
                changePercent: 0.5,
                category: 'bonds',
                lastUpdated: new Date().toISOString()
              }
            ],
            metrics: {
              totalPortfolioValue: 3850000,
              totalReturn: 112500,
              totalReturnPercent: 3.0,
              monthlyReturn: 15000,
              monthlyReturnPercent: 0.4,
              riskScore: 6.5,
              diversificationScore: 8.2
            },
            recentTransactions: [
              {
                id: '1',
                type: 'buy',
                asset: 'Офисный центр "Бизнес-Плаза"',
                amount: 500000,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                id: '2',
                type: 'dividend',
                asset: 'Акции TechCorp',
                amount: 15000,
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                id: '3',
                type: 'sell',
                asset: 'Облигации Газпрома',
                amount: 200000,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              }
            ],
            marketTrends: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
              value: 3500000 + Math.random() * 500000
            }))
          }
          
          set({ dashboardData: mockData, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка загрузки данных',
            isLoading: false 
          })
        }
      },

      // Обновление портфеля
      updatePortfolio: (portfolio: PortfolioData[]) => {
        const currentData = get().dashboardData
        if (currentData) {
          set({
            dashboardData: {
              ...currentData,
              portfolio
            }
          })
        }
      },

      // Очистка ошибки
      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'investor-store',
      partialize: (state) => ({ 
        dashboardData: state.dashboardData 
      })
    }
  )
)
