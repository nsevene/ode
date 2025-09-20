import React, { useState } from 'react'
import { FaFolder, FaFile, FaUpload, FaDownload, FaTrash, FaEdit, FaEye, FaLock, FaUnlock, FaHome, FaSearch, FaFilter, FaSort } from 'react-icons/fa'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: string
  permissions: 'read' | 'write' | 'admin'
}

const DataRoomPage: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name')

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Финансовые отчеты',
      type: 'folder',
      modified: '2024-12-19T10:00:00Z',
      permissions: 'read'
    },
    {
      id: '2',
      name: 'Юридические документы',
      type: 'folder',
      modified: '2024-12-18T15:30:00Z',
      permissions: 'read'
    },
    {
      id: '3',
      name: 'Техническая документация',
      type: 'folder',
      modified: '2024-12-17T09:15:00Z',
      permissions: 'write'
    },
    {
      id: '4',
      name: 'Отчет_2024_Q4.pdf',
      type: 'file',
      size: 2048576,
      modified: '2024-12-19T14:20:00Z',
      permissions: 'read'
    },
    {
      id: '5',
      name: 'Договор_аренды_001.docx',
      type: 'file',
      size: 1024000,
      modified: '2024-12-18T11:45:00Z',
      permissions: 'write'
    },
    {
      id: '6',
      name: 'Презентация_инвесторам.pptx',
      type: 'file',
      size: 5242880,
      modified: '2024-12-17T16:30:00Z',
      permissions: 'read'
    }
  ])

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

  const filteredFiles = files
    .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'modified':
          return new Date(b.modified).getTime() - new Date(a.modified).getTime()
        case 'size':
          return (b.size || 0) - (a.size || 0)
        default:
          return 0
      }
    })

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

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="ode-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
            <div>
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal">Data Room</h1>
              <p className="ode-text-gray">Управление документами и файлами</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => window.location.href = '/'}
                className="ode-btn ode-btn-secondary"
              >
                <FaHome style={{ marginRight: '8px' }} />
                На главную
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ode-container" style={{ padding: '32px 0' }}>
        {/* Toolbar */}
        <div className="ode-card ode-mb-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '300px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', width: '16px', height: '16px' }} />
                <input
                  type="text"
                  placeholder="Поиск файлов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="form-select"
                style={{ minWidth: '120px' }}
              >
                <option value="name">По имени</option>
                <option value="modified">По дате</option>
                <option value="size">По размеру</option>
              </select>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="ode-btn ode-btn-primary"
              >
                <FaUpload style={{ marginRight: '8px' }} />
                Загрузить
              </button>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="ode-card ode-mb-4" style={{ border: '2px dashed #d1d5db', background: '#f9fafb' }}>
            <div className="ode-text-center" style={{ padding: '32px' }}>
              <FaUpload style={{ width: '48px', height: '48px', color: '#6b7280', margin: '0 auto 16px' }} />
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">Загрузить файлы</h3>
              <p className="ode-text-gray ode-mb-4">Перетащите файлы сюда или нажмите для выбора</p>
              <button className="ode-btn ode-btn-primary">
                Выбрать файлы
              </button>
            </div>
          </div>
        )}

        {/* Files List */}
        <div className="ode-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="ode-text-lg ode-font-semibold ode-text-charcoal">
              Файлы ({filteredFiles.length})
            </h2>
            {selectedFiles.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="ode-btn ode-btn-sm" style={{ background: '#f9fafb', color: '#374151' }}>
                  <FaDownload style={{ marginRight: '4px' }} />
                  Скачать
                </button>
                <button className="ode-btn ode-btn-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <FaTrash style={{ marginRight: '4px' }} />
                  Удалить
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`ode-card ${selectedFiles.includes(file.id) ? 'ode-card-interactive' : ''}`}
                style={{ 
                  padding: '16px',
                  border: selectedFiles.includes(file.id) ? '2px solid #8B0000' : undefined,
                  background: selectedFiles.includes(file.id) ? '#fef2f2' : undefined
                }}
                onClick={() => handleFileSelect(file.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {file.type === 'folder' ? (
                        <FaFolder style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                      ) : (
                        <FaFile style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                      )}
                      <span className="ode-text-sm ode-font-medium ode-text-charcoal">{file.name}</span>
                    </div>
                    <span className="badge" style={{ 
                      background: getPermissionColor(file.permissions) + '20',
                      color: getPermissionColor(file.permissions),
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getPermissionText(file.permissions)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                      <span>{formatFileSize(file.size)}</span>
                      <span>{formatDate(file.modified)}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFileAction('view', file.id)
                        }}
                        className="ode-btn ode-btn-sm"
                        style={{ background: '#f9fafb', color: '#374151' }}
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFileAction('download', file.id)
                        }}
                        className="ode-btn ode-btn-sm"
                        style={{ background: '#dbeafe', color: '#2563eb' }}
                      >
                        <FaDownload />
                      </button>
                      {file.permissions !== 'read' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileAction('edit', file.id)
                          }}
                          className="ode-btn ode-btn-sm"
                          style={{ background: '#fef3c7', color: '#f59e0b' }}
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="ode-text-center" style={{ padding: '48px 0' }}>
              <FaFile style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
              <p className="ode-text-gray">Файлы не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataRoomPage