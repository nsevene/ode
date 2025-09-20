import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { 
  FaSearch, FaFilter, FaMapMarkerAlt, FaDollarSign, FaBuilding, FaCalendar, 
  FaStar, FaHeart, FaShare, FaEye, FaChartLine, FaUsers, FaClock,
  FaArrowUp, FaArrowDown, FaSortAmountDown, FaSortAmountUp
} from 'react-icons/fa'
import InvestorNavigation from '../../components/investors/InvestorNavigation'
import { investorApi, type InvestmentOpportunity } from '../../lib/api/investor'

const MarketplacePage: React.FC = () => {
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await investorApi.getInvestmentOpportunities()
        setOpportunities(data)
      } catch (error) {
        console.error('Error fetching opportunities:', error)
        // Fallback to mock data
        setOpportunities([
          {
            id: '1',
            title: 'Бизнес-центр "Солнечный" - Офисные помещения',
            description: 'Современный бизнес-центр в центре Москвы с отличной транспортной доступностью. Высокий класс энергоэффективности.',
            type: 'commercial',
            status: 'active',
            location: 'Москва, ул. Тверская, 15',
            totalInvestment: 50000000,
            minInvestment: 1000000,
            expectedReturn: 12.5,
            investmentPeriod: 36,
            riskLevel: 'medium',
            images: ['/api/placeholder/400/300'],
            features: ['Парковка', 'Кондиционер', 'Лифт', 'Охрана'],
            documents: ['Презентация', 'Финансовая модель', 'Юридические документы'],
            created_at: '2024-12-15T10:00:00Z',
            updated_at: '2024-12-20T10:00:00Z'
          },
          {
            id: '2',
            title: 'Торговый центр "Мега" - Реконструкция',
            description: 'Крупный торговый центр на стадии реконструкции. Потенциал роста доходности после завершения работ.',
            type: 'retail',
            status: 'active',
            location: 'Москва, ул. Арбат, 25',
            totalInvestment: 80000000,
            minInvestment: 2000000,
            expectedReturn: 15.2,
            investmentPeriod: 48,
            riskLevel: 'high',
            images: ['/api/placeholder/400/300'],
            features: ['Парковка', 'Эскалаторы', 'Лифты'],
            documents: ['Бизнес-план', 'Техническое задание', 'Разрешения'],
            created_at: '2024-12-10T10:00:00Z',
            updated_at: '2024-12-18T10:00:00Z'
          },
          {
            id: '3',
            title: 'Складской комплекс "Логистик"',
            description: 'Современный складской комплекс с развитой логистической инфраструктурой. Стабильный доход от долгосрочных арендаторов.',
            type: 'warehouse',
            status: 'active',
            location: 'Московская область, г. Химки',
            totalInvestment: 30000000,
            minInvestment: 500000,
            expectedReturn: 8.5,
            investmentPeriod: 24,
            riskLevel: 'low',
            images: ['/api/placeholder/400/300'],
            features: ['Железнодорожная ветка', 'Погрузочные рампы', 'Охрана'],
            documents: ['Анализ рынка', 'Договоры аренды', 'Сертификаты'],
            created_at: '2024-12-05T10:00:00Z',
            updated_at: '2024-12-15T10:00:00Z'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || opportunity.type === filterType
    const matchesStatus = filterStatus === 'all' || opportunity.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'return_high':
        return b.expectedReturn - a.expectedReturn
      case 'return_low':
        return a.expectedReturn - b.expectedReturn
      case 'investment_high':
        return b.totalInvestment - a.totalInvestment
      case 'investment_low':
        return a.totalInvestment - b.totalInvestment
      default:
        return 0
    }
  })

  const handleToggleFavorite = (opportunityId: string) => {
    setFavorites(prev => 
      prev.includes(opportunityId) 
        ? prev.filter(id => id !== opportunityId)
        : [...prev, opportunityId]
    )
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#16a34a'
      case 'medium': return '#f59e0b'
      case 'high': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Низкий'
      case 'medium': return 'Средний'
      case 'high': return 'Высокий'
      default: return 'Неизвестно'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'commercial': return 'Коммерческая'
      case 'retail': return 'Торговая'
      case 'warehouse': return 'Складская'
      case 'residential': return 'Жилая'
      default: return 'Другая'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активная'
      case 'funding': return 'Сбор средств'
      case 'completed': return 'Завершена'
      case 'cancelled': return 'Отменена'
      default: return 'Неизвестно'
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('investor.marketplace.title', 'Маркетплейс инвестиций')} - ODPortal B2B</title>
        <meta name="description" content={t('investor.marketplace.description', 'Каталог инвестиционных возможностей для инвесторов')} />
      </Helmet>
      
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-dashboard-layout">
            <InvestorNavigation />
            
            <div className="ode-dashboard-content">
              <div className="ode-dashboard-header">
                <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
                  {t('investor.marketplace.heading', 'Маркетплейс инвестиций')}
                </h1>
                <p className="ode-text-gray">
                  {t('investor.marketplace.description', 'Каталог инвестиционных возможностей для инвесторов')}
                </p>
              </div>

              {/* Filters and Search */}
              <div className="ode-card ode-mb-6">
                <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-4 ode-gap-4 ode-mb-4">
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Поиск</label>
                    <div className="ode-relative">
                      <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 ode-transform ode--translate-y-1/2 ode-text-gray-400" />
                      <input
                        type="text"
                        placeholder="Название, описание, локация..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ode-w-full ode-pl-10 ode-pr-4 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary ode-focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Тип</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все типы</option>
                      <option value="commercial">Коммерческая</option>
                      <option value="retail">Торговая</option>
                      <option value="warehouse">Складская</option>
                      <option value="residential">Жилая</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Статус</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="all">Все статусы</option>
                      <option value="active">Активные</option>
                      <option value="funding">Сбор средств</option>
                      <option value="completed">Завершенные</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">Сортировка</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    >
                      <option value="newest">Новые</option>
                      <option value="oldest">Старые</option>
                      <option value="return_high">Доходность ↓</option>
                      <option value="return_low">Доходность ↑</option>
                      <option value="investment_high">Инвестиция ↓</option>
                      <option value="investment_low">Инвестиция ↑</option>
                    </select>
                  </div>
                </div>
                
                <div className="ode-flex ode-justify-between ode-items-center">
                  <div className="ode-flex ode-items-center ode-gap-4">
                    <span className="ode-text-sm ode-text-gray">
                      Найдено: {filteredOpportunities.length} возможностей
                    </span>
                  </div>
                  
                  <div className="ode-flex ode-items-center ode-gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`ode-p-2 ode-rounded-lg ode-transition ${
                        viewMode === 'grid' ? 'ode-bg-primary ode-text-white' : 'ode-bg-gray-100 ode-text-gray-600'
                      }`}
                    >
                      <FaBuilding />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`ode-p-2 ode-rounded-lg ode-transition ${
                        viewMode === 'list' ? 'ode-bg-primary ode-text-white' : 'ode-bg-gray-100 ode-text-gray-600'
                      }`}
                    >
                      <FaChartLine />
                    </button>
                  </div>
                </div>
              </div>

              {/* Opportunities Grid/List */}
              <div className={viewMode === 'grid' ? 'ode-grid ode-grid-1 ode-md-grid-2 ode-lg-grid-3 ode-gap-6' : 'ode-space-y-4'}>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="ode-card">
                      <div className="ode-animate-pulse">
                        <div className="ode-h-48 ode-bg-gray-200 ode-rounded-t-lg"></div>
                        <div className="ode-p-6">
                          <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                          <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-mb-4"></div>
                          <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="ode-card ode-hover-shadow ode-transition">
                      {/* Image */}
                      <div className="ode-relative">
                        <div className="ode-h-48 ode-bg-gray-200 ode-rounded-t-lg ode-flex ode-items-center ode-justify-center">
                          <FaBuilding className="ode-text-4xl ode-text-gray-400" />
                        </div>
                        
                        {/* Status Badge */}
                        <div className="ode-absolute ode-top-4 ode-left-4">
                          <span className="badge" style={{
                            background: opportunity.status === 'active' ? '#16a34a20' : '#f59e0b20',
                            color: opportunity.status === 'active' ? '#16a34a' : '#f59e0b',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {getStatusText(opportunity.status)}
                          </span>
                        </div>
                        
                        {/* Favorite Button */}
                        <button
                          onClick={() => handleToggleFavorite(opportunity.id)}
                          className="ode-absolute ode-top-4 ode-right-4 ode-p-2 ode-bg-white ode-rounded-full ode-shadow-md ode-hover:bg-gray-50 ode-transition"
                        >
                          <FaHeart className={`ode-text-lg ${
                            favorites.includes(opportunity.id) ? 'ode-text-red-500' : 'ode-text-gray-400'
                          }`} />
                        </button>
                      </div>
                      
                      {/* Content */}
                      <div className="ode-p-6">
                        <div className="ode-flex ode-justify-between ode-items-start ode-mb-2">
                          <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mr-2">
                            {opportunity.title}
                          </h3>
                          <span className="ode-text-xs ode-text-gray ode-whitespace-nowrap">
                            {getTypeText(opportunity.type)}
                          </span>
                        </div>
                        
                        <div className="ode-flex ode-items-center ode-gap-2 ode-mb-3">
                          <FaMapMarkerAlt className="ode-text-sm ode-text-gray-400" />
                          <span className="ode-text-sm ode-text-gray">{opportunity.location}</span>
                        </div>
                        
                        <p className="ode-text-sm ode-text-gray ode-mb-4 ode-line-clamp-2">
                          {opportunity.description}
                        </p>
                        
                        {/* Investment Details */}
                        <div className="ode-grid ode-grid-2 ode-gap-4 ode-mb-4">
                          <div>
                            <span className="ode-text-xs ode-text-gray">Общая инвестиция</span>
                            <p className="ode-text-sm ode-font-semibold ode-text-charcoal">
                              ₽{opportunity.totalInvestment.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="ode-text-xs ode-text-gray">Мин. инвестиция</span>
                            <p className="ode-text-sm ode-font-semibold ode-text-charcoal">
                              ₽{opportunity.minInvestment.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="ode-text-xs ode-text-gray">Ожидаемая доходность</span>
                            <p className="ode-text-sm ode-font-semibold ode-text-success">
                              {opportunity.expectedReturn}% годовых
                            </p>
                          </div>
                          <div>
                            <span className="ode-text-xs ode-text-gray">Период</span>
                            <p className="ode-text-sm ode-font-semibold ode-text-charcoal">
                              {opportunity.investmentPeriod} мес.
                            </p>
                          </div>
                        </div>
                        
                        {/* Risk Level */}
                        <div className="ode-flex ode-items-center ode-justify-between ode-mb-4">
                          <div className="ode-flex ode-items-center ode-gap-2">
                            <span className="ode-text-xs ode-text-gray">Уровень риска:</span>
                            <span className="ode-text-sm ode-font-medium" style={{ color: getRiskColor(opportunity.riskLevel) }}>
                              {getRiskText(opportunity.riskLevel)}
                            </span>
                          </div>
                          <div className="ode-flex ode-items-center ode-gap-1">
                            <FaStar className="ode-text-yellow-400" />
                            <span className="ode-text-sm ode-font-medium">4.8</span>
                          </div>
                        </div>
                        
                        {/* Features */}
                        <div className="ode-mb-4">
                          <div className="ode-flex ode-flex-wrap ode-gap-2">
                            {opportunity.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="ode-badge ode-badge-sm">
                                {feature}
                              </span>
                            ))}
                            {opportunity.features.length > 3 && (
                              <span className="ode-badge ode-badge-sm">
                                +{opportunity.features.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="ode-flex ode-gap-2">
                          <button className="ode-btn ode-btn-primary ode-flex-1">
                            <FaEye className="ode-mr-2" />
                            Подробнее
                          </button>
                          <button className="ode-btn ode-btn-secondary">
                            <FaShare />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {!loading && filteredOpportunities.length === 0 && (
                <div className="ode-text-center" style={{ padding: '48px 0' }}>
                  <FaBuilding className="ode-text-6xl ode-text-gray-300 ode-mb-4" />
                  <h3 className="ode-text-xl ode-font-semibold ode-text-gray ode-mb-2">
                    Инвестиционные возможности не найдены
                  </h3>
                  <p className="ode-text-gray">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MarketplacePage
