import React, { useState } from 'react'
import { 
  FaFolder, FaFile, FaUpload, FaDownload, FaTrash, FaEdit, FaEye, FaSearch, 
  FaFolderPlus, FaUnlock, FaShare, FaCopy, FaArrowsAlt as FaMove
} from 'react-icons/fa'
import AdminNavigation from '../../components/admin/AdminNavigation'

const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState('/')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDocument, setEditingDocument] = useState<any>(null)

  const documents = [
    {
      id: '1',
      name: 'Финансовые отчеты',
      type: 'folder',
      category: 'finance',
      size: null,
      modified: '2024-12-19T10:00:00Z',
      permissions: 'admin',
      children: [
        { id: '1-1', name: 'Отчет_2024_Q4.pdf', type: 'file', size: 2048576, modified: '2024-12-19T14:20:00Z', permissions: 'read' },
        { id: '1-2', name: 'Бухгалтерский_баланс.xlsx', type: 'file', size: 1024000, modified: '2024-12-18T11:45:00Z', permissions: 'read' }
      ]
    },
    {
      id: '2',
      name: 'Юридические документы',
      type: 'folder',
      category: 'legal',
      size: null,
      modified: '2024-12-18T15:30:00Z',
      permissions: 'admin',
      children: [
        { id: '2-1', name: 'Договор_аренды_001.docx', type: 'file', size: 1024000, modified: '2024-12-18T11:45:00Z', permissions: 'write' },
        { id: '2-2', name: 'Лицензии.pdf', type: 'file', size: 5242880, modified: '2024-12-17T16:30:00Z', permissions: 'read' }
      ]
    },
    {
      id: '3',
      name: 'Техническая документация',
      type: 'folder',
      category: 'technical',
      size: null,
      modified: '2024-12-17T09:15:00Z',
      permissions: 'write',
      children: [
        { id: '3-1', name: 'Планы_зданий.dwg', type: 'file', size: 10485760, modified: '2024-12-17T09:15:00Z', permissions: 'write' },
        { id: '3-2', name: 'Схемы_коммуникаций.pdf', type: 'file', size: 3145728, modified: '2024-12-16T14:20:00Z', permissions: 'read' }
      ]
    },
    {
      id: '4',
      name: 'Презентация_инвесторам.pptx',
      type: 'file',
      category: 'presentation',
      size: 5242880,
      modified: '2024-12-17T16:30:00Z',
      permissions: 'read'
    },
    {
      id: '5',
      name: 'Маркетинговые_материалы',
      type: 'folder',
      category: 'marketing',
      size: null,
      modified: '2024-12-16T12:00:00Z',
      permissions: 'write',
      children: [
        { id: '5-1', name: 'Брошюра_компании.pdf', type: 'file', size: 2097152, modified: '2024-12-16T12:00:00Z', permissions: 'read' },
        { id: '5-2', name: 'Логотипы.zip', type: 'file', size: 5242880, modified: '2024-12-15T10:30:00Z', permissions: 'read' }
      ]
    }
  ]

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'finance', name: 'Финансы' },
    { id: 'legal', name: 'Юридические' },
    { id: 'technical', name: 'Технические' },
    { id: 'marketing', name: 'Маркетинг' },
    { id: 'presentation', name: 'Презентации' }
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin': return '#dc2626'
      case 'write': return '#f59e0b'
      case 'read': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getPermissionText = (permission: string) => {
    switch (permission) {
      case 'admin': return 'Админ'
      case 'write': return 'Запись'
      case 'read': return 'Чтение'
      default: return permission
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'finance': return '#16a34a'
      case 'legal': return '#dc2626'
      case 'technical': return '#2563eb'
      case 'marketing': return '#8B5CF6'
      case 'presentation': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleFileAction = (action: string, fileId: string) => {
    console.log(`${action} file ${fileId}`)
    // Implement file actions here
  }

  // Функции для работы с документами
  const handleDocumentSelect = (documentId: string) => {
    setSelectedFiles(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    )
  }

  const handleViewDocument = (document: any) => {
    console.log('Просмотр документа:', document)
    alert(`Просмотр документа: ${document.name}`)
  }

  const handleEditDocument = (document: any) => {
    console.log('Редактирование документа:', document)
    setEditingDocument(document)
    setShowEditModal(true)
  }

  const handleDeleteDocument = (documentId: string) => {
    console.log('Удаление документа:', documentId)
    if (confirm('Удалить этот документ?')) {
      alert('Документ удален')
    }
  }

  const handleAddDocument = () => {
    console.log('Добавление нового документа')
    setShowAddModal(true)
  }

  const handleBulkDocumentAction = (action: string) => {
    console.log('Массовое действие:', action, 'для документов:', selectedFiles)
    if (selectedFiles.length === 0) {
      alert('Выберите документы для выполнения действия')
      return
    }
    
    switch (action) {
      case 'delete':
        if (confirm(`Удалить ${selectedFiles.length} документов?`)) {
          alert('Документы удалены')
          setSelectedFiles([])
        }
        break
      case 'download':
        alert(`Скачивание ${selectedFiles.length} документов`)
        break
      case 'share':
        alert(`Поделиться ${selectedFiles.length} документами`)
        break
      default:
        alert(`Действие ${action} для ${selectedFiles.length} документов`)
    }
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
      <div className="ode-container">
        <div className="ode-dashboard-layout">
          <AdminNavigation />
          <div className="ode-dashboard-content">
            {/* Header */}
            <div className="ode-dashboard-header">
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">Управление документами</h1>
              <p className="ode-text-gray">Организация и управление файлами и документами</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="ode-btn ode-btn-primary">
                <FaUpload style={{ marginRight: '8px' }} />
                Загрузить файлы
              </button>
              <button className="ode-btn ode-btn-secondary">
                <FaFolderPlus style={{ marginRight: '8px' }} />
                Создать папку
              </button>
            </div>

            <div style={{ marginTop: '32px' }}>
        {/* Filters */}
        <div className="ode-card ode-mb-4">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
              <input
                type="text"
                placeholder="Поиск файлов и папок..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select"
              >
                <option value="all">Все типы</option>
                <option value="folder">Папки</option>
                <option value="file">Файлы</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="ode-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">
              Документы ({filteredDocuments.length})
            </h2>
            {selectedFiles.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                  <FaDownload style={{ marginRight: '4px' }} />
                  Скачать
                </button>
                <button className="ode-btn ode-btn-sm" style={{ background: '#dbeafe', color: '#2563eb' }}>
                  <FaMove style={{ marginRight: '4px' }} />
                  Переместить
                </button>
                <button className="ode-btn ode-btn-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <FaTrash style={{ marginRight: '4px' }} />
                  Удалить
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredDocuments.map((doc) => (
              <div key={doc.id}>
                <div
                  className={`ode-card ${selectedFiles.includes(doc.id) ? 'ode-card-interactive' : ''}`}
                  style={{ 
                    padding: '16px',
                    border: selectedFiles.includes(doc.id) ? '2px solid #8B0000' : undefined,
                    background: selectedFiles.includes(doc.id) ? '#fef2f2' : undefined
                  }}
                  onClick={() => handleFileSelect(doc.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {doc.type === 'folder' ? (
                          <FaFolder style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                        ) : (
                          <FaFile style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                        )}
                        <span className="ode-text-sm ode-font-medium ode-text-charcoal">{doc.name}</span>
                        {doc.children && (
                          <span className="ode-text-xs ode-text-gray">({doc.children.length} файлов)</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge" style={{ 
                          background: getCategoryColor(doc.category) + '20',
                          color: getCategoryColor(doc.category),
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {categories.find(c => c.id === doc.category)?.name}
                        </span>
                        <span className="badge" style={{ 
                          background: getPermissionColor(doc.permissions) + '20',
                          color: getPermissionColor(doc.permissions),
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {getPermissionText(doc.permissions)}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                        <span>{formatFileSize(doc.size)}</span>
                        <span>{formatDate(doc.modified)}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileAction('view', doc.id)
                          }}
                          className="ode-btn ode-btn-sm"
                          style={{ background: '#f9fafb', color: '#374151' }}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileAction('download', doc.id)
                          }}
                          className="ode-btn ode-btn-sm"
                          style={{ background: '#dbeafe', color: '#2563eb' }}
                        >
                          <FaDownload />
                        </button>
                        {doc.permissions !== 'read' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFileAction('edit', doc.id)
                            }}
                            className="ode-btn ode-btn-sm"
                            style={{ background: '#fef3c7', color: '#f59e0b' }}
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileAction('share', doc.id)
                          }}
                          className="ode-btn ode-btn-sm"
                          style={{ background: '#f0fdf4', color: '#16a34a' }}
                        >
                          <FaShare />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show children if folder is expanded */}
                {doc.children && (
                  <div style={{ marginLeft: '32px', marginTop: '8px' }}>
                    {doc.children.map((child) => (
                      <div key={child.id} className="ode-card" style={{ padding: '12px', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaFile style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span className="ode-text-sm ode-text-charcoal">{child.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="ode-text-xs ode-text-gray">{formatFileSize(child.size)}</span>
                            <span className="ode-text-xs ode-text-gray">{formatDate(child.modified)}</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                                <FaEye />
                              </button>
                              <button className="ode-btn ode-btn-sm" style={{ background: '#dbeafe', color: '#2563eb' }}>
                                <FaDownload />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="ode-text-center" style={{ padding: '48px 0' }}>
              <FaFile style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
              <p className="ode-text-gray">Документы не найдены</p>
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsPage
