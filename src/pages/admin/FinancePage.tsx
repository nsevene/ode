import React, { useState } from 'react'
import { 
  FaDollarSign, FaChartLine, FaCreditCard, FaReceipt, FaBuilding, FaUsers, 
  FaCalendar, FaDownload, FaFilter, FaSearch, FaPlus, FaEdit, FaEye,
  FaArrowUp, FaArrowDown, FaArrowUp as FaTrendingUp, FaArrowDown as FaTrendingDown
} from 'react-icons/fa'

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'reports' | 'invoices'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('month')
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)

  const financialStats = [
    {
      title: 'Общий доход',
      value: '₽2,450,000',
      change: '+12.5%',
      changeType: 'positive',
      icon: FaDollarSign,
      color: '#16a34a'
    },
    {
      title: 'Месячный доход',
      value: '₽450,000',
      change: '+8.2%',
      changeType: 'positive',
      icon: FaChartLine,
      color: '#2563eb'
    },
    {
      title: 'Ожидаемые платежи',
      value: '₽180,000',
      change: '-2.1%',
      changeType: 'negative',
      icon: FaCreditCard,
      color: '#f59e0b'
    },
    {
      title: 'Непогашенные долги',
      value: '₽45,000',
      change: '+15.3%',
      changeType: 'negative',
      icon: FaReceipt,
      color: '#dc2626'
    }
  ]

  const transactions = [
    {
      id: 1,
      type: 'income',
      amount: 150000,
      description: 'Арендная плата - БЦ "Солнечный"',
      tenant: 'ООО "ТехноИнновации"',
      date: '2024-12-19',
      status: 'completed',
      category: 'rent'
    },
    {
      id: 2,
      type: 'income',
      amount: 80000,
      description: 'Арендная плата - Склад "Логистик"',
      tenant: 'ИП Сидоров А.А.',
      date: '2024-12-18',
      status: 'completed',
      category: 'rent'
    },
    {
      id: 3,
      type: 'expense',
      amount: 25000,
      description: 'Коммунальные услуги',
      tenant: 'УК "Солнечный"',
      date: '2024-12-17',
      status: 'pending',
      category: 'utilities'
    },
    {
      id: 4,
      type: 'income',
      amount: 200000,
      description: 'Арендная плата - ТЦ "Мега"',
      tenant: 'ЗАО "ИнвестГрупп"',
      date: '2024-12-16',
      status: 'overdue',
      category: 'rent'
    }
  ]

  const invoices = [
    {
      id: 'INV-001',
      tenant: 'ООО "ТехноИнновации"',
      amount: 150000,
      dueDate: '2024-12-25',
      status: 'paid',
      created: '2024-12-01'
    },
    {
      id: 'INV-002',
      tenant: 'ИП Сидоров А.А.',
      amount: 80000,
      dueDate: '2024-12-20',
      status: 'pending',
      created: '2024-12-01'
    },
    {
      id: 'INV-003',
      tenant: 'ЗАО "ИнвестГрупп"',
      amount: 200000,
      dueDate: '2024-12-15',
      status: 'overdue',
      created: '2024-12-01'
    }
  ]

  // Функции для работы с финансами
  const handleTransactionSelect = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    )
  }

  const handleViewTransaction = (transaction: any) => {
    console.log('Просмотр транзакции:', transaction)
    alert(`Просмотр транзакции: ${transaction.description}`)
  }

  const handleEditTransaction = (transaction: any) => {
    console.log('Редактирование транзакции:', transaction)
    setEditingTransaction(transaction)
    setShowEditModal(true)
  }

  const handleDeleteTransaction = (transactionId: string) => {
    console.log('Удаление транзакции:', transactionId)
    if (confirm('Удалить эту транзакцию?')) {
      alert('Транзакция удалена')
    }
  }

  const handleAddTransaction = () => {
    console.log('Добавление новой транзакции')
    setShowAddModal(true)
  }

  const handleBulkTransactionAction = (action: string) => {
    console.log('Массовое действие:', action, 'для транзакций:', selectedTransactions)
    if (selectedTransactions.length === 0) {
      alert('Выберите транзакции для выполнения действия')
      return
    }
    
    switch (action) {
      case 'export':
        alert(`Экспорт ${selectedTransactions.length} транзакций`)
        break
      case 'delete':
        if (confirm(`Удалить ${selectedTransactions.length} транзакций?`)) {
          alert('Транзакции удалены')
          setSelectedTransactions([])
        }
        break
      default:
        alert(`Действие ${action} для ${selectedTransactions.length} транзакций`)
    }
  }

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: FaChartLine },
    { id: 'transactions', name: 'Транзакции', icon: FaReceipt },
    { id: 'reports', name: 'Отчеты', icon: FaDownload },
    { id: 'invoices', name: 'Счета', icon: FaCreditCard }
  ]

  const getTransactionTypeColor = (type: string) => {
    return type === 'income' ? '#16a34a' : '#dc2626'
  }

  const getTransactionTypeText = (type: string) => {
    return type === 'income' ? 'Доход' : 'Расход'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#16a34a'
      case 'pending': return '#f59e0b'
      case 'overdue': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнено'
      case 'pending': return 'Ожидает'
      case 'overdue': return 'Просрочено'
      default: return status
    }
  }

  const renderOverview = () => (
    <div className="ode-space-y-6">
      <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Финансовый обзор</h2>
      
      {/* Stats */}
      <div className="ode-grid ode-grid-4">
        {financialStats.map((stat) => (
          <div key={stat.title} className="ode-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p className="ode-text-sm ode-font-medium ode-text-gray ode-mb-1">{stat.title}</p>
                <p className="ode-text-2xl ode-font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
              <stat.icon style={{ width: '24px', height: '24px', color: stat.color }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {stat.changeType === 'positive' ? (
                <FaArrowUp style={{ width: '12px', height: '12px', color: '#16a34a' }} />
              ) : (
                <FaArrowDown style={{ width: '12px', height: '12px', color: '#dc2626' }} />
              )}
              <span className={`ode-text-sm ode-font-medium ${
                stat.changeType === 'positive' ? 'ode-text-success' : 'ode-text-error'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="ode-card">
        <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Динамика доходов</h3>
        <div style={{ height: '300px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="ode-text-gray">График доходов</span>
        </div>
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="ode-space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Транзакции</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ode-btn ode-btn-primary">
            <FaPlus style={{ marginRight: '8px' }} />
            Добавить транзакцию
          </button>
          <button className="ode-btn ode-btn-secondary">
            <FaDownload style={{ marginRight: '8px' }} />
            Экспорт
          </button>
        </div>
      </div>

      <div className="ode-card">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
            <input
              type="text"
              placeholder="Поиск по описанию или арендатору..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <select className="form-select" style={{ minWidth: '150px' }}>
            <option value="all">Все типы</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map((transaction) => (
            <div key={transaction.id} className="ode-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: getTransactionTypeColor(transaction.type) + '20', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {transaction.type === 'income' ? (
                      <FaTrendingUp style={{ width: '16px', height: '16px', color: getTransactionTypeColor(transaction.type) }} />
                    ) : (
                      <FaTrendingDown style={{ width: '16px', height: '16px', color: getTransactionTypeColor(transaction.type) }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">{transaction.description}</h4>
                    <p className="ode-text-sm ode-text-gray">{transaction.tenant}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className={`ode-text-lg ode-font-bold ${
                      transaction.type === 'income' ? 'ode-text-success' : 'ode-text-error'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₽{transaction.amount.toLocaleString()}
                    </p>
                    <span className="badge" style={{ 
                      background: getStatusColor(transaction.status) + '20',
                      color: getStatusColor(transaction.status),
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getStatusText(transaction.status)}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                    <FaEye />
                  </button>
                  <button className="ode-btn ode-btn-sm" style={{ background: '#dbeafe', color: '#2563eb' }}>
                    <FaEdit />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderInvoices = () => (
    <div className="ode-space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal">Счета</h2>
        <button className="ode-btn ode-btn-primary">
          <FaPlus style={{ marginRight: '8px' }} />
          Создать счет
        </button>
      </div>

      <div className="ode-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {invoices.map((invoice) => (
            <div key={invoice.id} className="ode-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#dbeafe', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <FaCreditCard style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 className="ode-text-md ode-font-semibold ode-text-charcoal">{invoice.id}</h4>
                    <p className="ode-text-sm ode-text-gray">{invoice.tenant}</p>
                    <p className="ode-text-xs ode-text-gray">Создан: {invoice.created}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="ode-text-lg ode-font-bold ode-text-charcoal">₽{invoice.amount.toLocaleString()}</p>
                    <p className="ode-text-sm ode-text-gray">Срок: {invoice.dueDate}</p>
                    <span className="badge" style={{ 
                      background: getStatusColor(invoice.status) + '20',
                      color: getStatusColor(invoice.status),
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getStatusText(invoice.status)}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                    <FaEye />
                  </button>
                  <button className="ode-btn ode-btn-sm" style={{ background: '#dbeafe', color: '#2563eb' }}>
                    <FaDownload />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="ode-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
            <div>
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal">Финансовый модуль</h1>
              <p className="ode-text-gray">Управление финансами, транзакциями и отчетностью</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="ode-btn ode-btn-secondary">
                <FaDownload style={{ marginRight: '8px' }} />
                Экспорт данных
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ode-container" style={{ padding: '32px 0' }}>
        {/* Tabs */}
        <div className="tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon style={{ width: '16px', height: '16px' }} />
                {tab.name}
              </button>
            ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'invoices' && renderInvoices()}
        {activeTab === 'reports' && (
          <div className="ode-text-center" style={{ padding: '48px 0' }}>
            <FaDownload style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
            <p className="ode-text-gray">Модуль отчетов в разработке</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FinancePage
