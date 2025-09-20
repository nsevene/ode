import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { 
  FaUpload, FaDownload, FaEye, FaCheck, FaTimes, FaSpinner,
  FaUser, FaIdCard, FaFileAlt, FaShield, FaCamera, FaSignature,
  FaExclamationTriangle, FaCheckCircle, FaClock, FaLock,
  FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar,
  FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSortAmountDown
} from 'react-icons/fa'
import InvestorNavigation from '../../components/investors/InvestorNavigation'
import { investorApi, type KYCStatus } from '../../lib/api/investor'

const KYCPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<Array<{
    id: string
    name: string
    type: string
    status: 'pending' | 'approved' | 'rejected'
    uploadedAt: string
    url: string
  }>>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        const status = await investorApi.getKYCStatus()
        setKycStatus(status)
        
        // Mock documents for demonstration
        setDocuments([
          {
            id: '1',
            name: 'passport.pdf',
            type: 'passport',
            status: 'approved',
            uploadedAt: '2024-12-15T10:00:00Z',
            url: '/documents/passport.pdf'
          },
          {
            id: '2',
            name: 'bank_statement.pdf',
            type: 'bank_statement',
            status: 'pending',
            uploadedAt: '2024-12-18T14:30:00Z',
            url: '/documents/bank_statement.pdf'
          },
          {
            id: '3',
            name: 'income_certificate.pdf',
            type: 'income_certificate',
            status: 'rejected',
            uploadedAt: '2024-12-19T09:15:00Z',
            url: '/documents/income_certificate.pdf'
          }
        ])
      } catch (error) {
        console.error('Error fetching KYC status:', error)
        // Fallback to mock data
        setKycStatus({
          id: '1',
          investor_id: 'investor_123',
          status: 'pending',
          documents: ['passport.pdf', 'bank_statement.pdf'],
          submitted_at: '2024-12-15T10:00:00Z',
          reviewed_at: null,
          reviewed_by: null,
          notes: 'Ожидает проверки документов',
          requirements: [
            'Паспорт или удостоверение личности',
            'Справка о доходах за последние 3 месяца',
            'Банковская выписка',
            'Справка об отсутствии судимости'
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchKYCStatus()
  }, [])

  const handleFileUpload = async (file: File, type: string) => {
    try {
      setUploading(true)
      await investorApi.uploadKYCDocument(file, type)
      
      // Add to documents list
      const newDocument = {
        id: Date.now().toString(),
        name: file.name,
        type,
        status: 'pending' as const,
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file)
      }
      setDocuments(prev => [...prev, newDocument])
      
      alert('Документ успешно загружен')
      setShowUploadModal(false)
      setSelectedFile(null)
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Ошибка при загрузке документа')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitKYC = async () => {
    try {
      setUploading(true)
      await investorApi.submitKYC()
      setKycStatus(prev => prev ? { ...prev, status: 'pending' } : null)
      alert('KYC заявка успешно подана')
    } catch (error) {
      console.error('Error submitting KYC:', error)
      alert('Ошибка при подаче KYC заявки')
    } finally {
      setUploading(false)
    }
  }

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document)
    setShowDocumentModal(true)
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) return

    try {
      await investorApi.deleteKYCDocument(documentId)
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      alert('Документ успешно удален')
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Ошибка при удалении документа')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#16a34a'
      case 'rejected': return '#dc2626'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Одобрено'
      case 'rejected': return 'Отклонено'
      case 'pending': return 'Ожидает проверки'
      default: return 'Неизвестно'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return FaCheckCircle
      case 'rejected': return FaTimes
      case 'pending': return FaClock
      default: return FaExclamationTriangle
    }
  }

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case 'passport': return 'Паспорт'
      case 'bank_statement': return 'Банковская выписка'
      case 'income_certificate': return 'Справка о доходах'
      case 'criminal_record': return 'Справка об отсутствии судимости'
      default: return type
    }
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

  const getOverallStatus = () => {
    if (!kycStatus) return 'not_started'
    return kycStatus.status
  }

  const getOverallStatusText = () => {
    switch (getOverallStatus()) {
      case 'approved': return 'Верификация завершена'
      case 'rejected': return 'Верификация отклонена'
      case 'pending': return 'Ожидает проверки'
      default: return 'Не начата'
    }
  }

  const getOverallStatusColor = () => {
    switch (getOverallStatus()) {
      case 'approved': return '#16a34a'
      case 'rejected': return '#dc2626'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getProgressPercentage = () => {
    if (!kycStatus) return 0
    const totalRequirements = kycStatus.requirements.length
    const completedDocuments = documents.filter(doc => doc.status === 'approved').length
    return Math.round((completedDocuments / totalRequirements) * 100)
  }

  return (
    <>
      <Helmet>
        <title>{t('investor.kyc.title', 'KYC Верификация')} - ODPortal</title>
        <meta name="description" content={t('investor.kyc.description', 'Верификация инвестора и проверка документов')} />
      </Helmet>
      
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '32px 0' }}>
        <div className="ode-container">
          <div className="ode-dashboard-layout">
            <InvestorNavigation />
            
            <div className="ode-dashboard-content">
              <div className="ode-dashboard-header">
                <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-2">
                  {t('investor.kyc.heading', 'KYC Верификация')}
                </h1>
                <p className="ode-text-gray">
                  {t('investor.kyc.description', 'Верификация инвестора и проверка документов')}
                </p>
              </div>

              {/* KYC Status Overview */}
              <div className="ode-card ode-mb-6">
                <div className="ode-p-6">
                  <div className="ode-flex ode-items-center ode-justify-between ode-mb-4">
                    <div className="ode-flex ode-items-center ode-gap-4">
                      <div 
                        className="ode-w-16 ode-h-16 ode-rounded-full ode-flex ode-items-center ode-justify-center"
                        style={{ backgroundColor: getOverallStatusColor() + '20' }}
                      >
                        <FaShield 
                          className="ode-text-3xl"
                          style={{ color: getOverallStatusColor() }}
                        />
                      </div>
                      <div>
                        <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
                          {getOverallStatusText()}
                        </h2>
                        <p className="ode-text-gray">
                          Прогресс: {getProgressPercentage()}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="ode-text-right">
                      <div className="ode-w-32 ode-h-4 ode-bg-gray-200 ode-rounded-full ode-overflow-hidden">
                        <div 
                          className="ode-h-full ode-bg-primary ode-transition-all"
                          style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                      </div>
                      <p className="ode-text-sm ode-text-gray ode-mt-2">
                        {documents.filter(doc => doc.status === 'approved').length} из {kycStatus?.requirements.length || 0} документов одобрено
                      </p>
                    </div>
                  </div>
                  
                  {kycStatus?.notes && (
                    <div className="ode-bg-blue-50 ode-p-4 ode-rounded-lg">
                      <p className="ode-text-sm ode-text-blue-800">
                        <FaExclamationTriangle className="ode-inline ode-mr-2" />
                        {kycStatus.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="ode-card ode-mb-6">
                <div className="ode-p-6">
                  <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">
                    Требуемые документы
                  </h3>
                  <div className="ode-grid ode-grid-1 ode-md-grid-2 ode-gap-4">
                    {kycStatus?.requirements.map((requirement, index) => {
                      const document = documents.find(doc => doc.type === requirement.toLowerCase().replace(/\s+/g, '_'))
                      const isCompleted = document?.status === 'approved'
                      
                      return (
                        <div key={index} className="ode-flex ode-items-center ode-gap-3 ode-p-3 ode-bg-gray-50 ode-rounded-lg">
                          <div className="ode-flex-shrink-0">
                            {isCompleted ? (
                              <FaCheckCircle className="ode-text-green-500 ode-text-xl" />
                            ) : (
                              <FaClock className="ode-text-gray-400 ode-text-xl" />
                            )}
                          </div>
                          <div className="ode-flex-1">
                            <p className="ode-text-sm ode-font-medium ode-text-charcoal">
                              {requirement}
                            </p>
                            {document && (
                              <p className="ode-text-xs ode-text-gray">
                                Статус: {getStatusText(document.status)}
                              </p>
                            )}
                          </div>
                          {document && (
                            <button
                              onClick={() => handleViewDocument(document)}
                              className="ode-btn ode-btn-ghost ode-btn-sm"
                            >
                              <FaEye />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Documents List */}
              <div className="ode-card ode-mb-6">
                <div className="ode-p-6">
                  <div className="ode-flex ode-items-center ode-justify-between ode-mb-4">
                    <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal">
                      Загруженные документы
                    </h3>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="ode-btn ode-btn-primary ode-btn-sm"
                    >
                      <FaUpload className="ode-mr-2" />
                      Загрузить документ
                    </button>
                  </div>
                  
                  <div className="ode-space-y-4">
                    {documents.map((document) => {
                      const StatusIcon = getStatusIcon(document.status)
                      
                      return (
                        <div key={document.id} className="ode-flex ode-items-center ode-justify-between ode-p-4 ode-bg-gray-50 ode-rounded-lg">
                          <div className="ode-flex ode-items-center ode-gap-4">
                            <div className="ode-w-12 ode-h-12 ode-bg-primary ode-rounded-lg ode-flex ode-items-center ode-justify-center">
                              <FaFileAlt className="ode-text-white ode-text-xl" />
                            </div>
                            <div>
                              <h4 className="ode-text-lg ode-font-medium ode-text-charcoal">
                                {document.name}
                              </h4>
                              <p className="ode-text-sm ode-text-gray">
                                {getDocumentTypeText(document.type)} • {formatDate(document.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="ode-flex ode-items-center ode-gap-2">
                            <span 
                              className="ode-badge"
                              style={{
                                backgroundColor: getStatusColor(document.status) + '20',
                                color: getStatusColor(document.status)
                              }}
                            >
                              <StatusIcon className="ode-mr-1" />
                              {getStatusText(document.status)}
                            </span>
                            <button
                              onClick={() => handleViewDocument(document)}
                              className="ode-btn ode-btn-ghost ode-btn-sm"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(document.id)}
                              className="ode-btn ode-btn-ghost ode-btn-sm ode-text-red-500"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {documents.length === 0 && (
                    <div className="ode-text-center ode-py-12">
                      <FaFileAlt className="ode-text-6xl ode-text-gray-300 ode-mb-4" />
                      <h3 className="ode-text-xl ode-font-semibold ode-text-gray ode-mb-2">
                        Документы не загружены
                      </h3>
                      <p className="ode-text-gray ode-mb-4">
                        Загрузите необходимые документы для прохождения KYC верификации
                      </p>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="ode-btn ode-btn-primary"
                      >
                        <FaUpload className="ode-mr-2" />
                        Загрузить первый документ
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="ode-card">
                <div className="ode-p-6">
                  <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">
                    Действия
                  </h3>
                  <div className="ode-flex ode-items-center ode-gap-4">
                    <button
                      onClick={handleSubmitKYC}
                      disabled={uploading || getProgressPercentage() < 100}
                      className="ode-btn ode-btn-primary"
                    >
                      {uploading ? (
                        <FaSpinner className="ode-animate-spin ode-mr-2" />
                      ) : (
                        <FaCheck className="ode-mr-2" />
                      )}
                      Подать на верификацию
                    </button>
                    <button className="ode-btn ode-btn-secondary">
                      <FaDownload className="ode-mr-2" />
                      Скачать шаблоны
                    </button>
                    <button className="ode-btn ode-btn-ghost">
                      <FaEye className="ode-mr-2" />
                      Просмотреть требования
                    </button>
                  </div>
                  
                  {getProgressPercentage() < 100 && (
                    <div className="ode-mt-4 ode-bg-yellow-50 ode-p-4 ode-rounded-lg">
                      <p className="ode-text-sm ode-text-yellow-800">
                        <FaExclamationTriangle className="ode-inline ode-mr-2" />
                        Для подачи на верификацию необходимо загрузить все требуемые документы
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
          <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-md ode-w-full ode-mx-4">
            <div className="ode-p-6">
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">
                Загрузить документ
              </h3>
              
              <div className="ode-space-y-4">
                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">
                    Тип документа
                  </label>
                  <select
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                    onChange={(e) => {
                      const fileInput = document.getElementById('file-input') as HTMLInputElement
                      if (fileInput) fileInput.click()
                    }}
                  >
                    <option value="">Выберите тип документа</option>
                    <option value="passport">Паспорт</option>
                    <option value="bank_statement">Банковская выписка</option>
                    <option value="income_certificate">Справка о доходах</option>
                    <option value="criminal_record">Справка об отсутствии судимости</option>
                  </select>
                </div>
                
                <div>
                  <label className="ode-text-sm ode-font-medium ode-text-gray ode-mb-2">
                    Файл
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="ode-w-full ode-px-3 ode-py-2 ode-border ode-border-gray-300 ode-rounded-lg ode-focus:ring-2 ode-focus:ring-primary"
                  />
                </div>
                
                {selectedFile && (
                  <div className="ode-bg-gray-50 ode-p-3 ode-rounded-lg">
                    <p className="ode-text-sm ode-text-charcoal">
                      <FaFileAlt className="ode-inline ode-mr-2" />
                      {selectedFile.name}
                    </p>
                    <p className="ode-text-xs ode-text-gray">
                      Размер: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
              
              <div className="ode-flex ode-items-center ode-gap-2 ode-mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="ode-btn ode-btn-ghost ode-flex-1"
                >
                  Отмена
                </button>
                <button
                  onClick={() => selectedFile && handleFileUpload(selectedFile, 'passport')}
                  disabled={!selectedFile || uploading}
                  className="ode-btn ode-btn-primary ode-flex-1"
                >
                  {uploading ? (
                    <FaSpinner className="ode-animate-spin ode-mr-2" />
                  ) : (
                    <FaUpload className="ode-mr-2" />
                  )}
                  Загрузить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="ode-fixed ode-inset-0 ode-bg-black ode-bg-opacity-50 ode-flex ode-items-center ode-justify-center ode-z-50">
          <div className="ode-bg-white ode-rounded-lg ode-shadow-xl ode-max-w-4xl ode-w-full ode-mx-4 ode-max-h-[90vh] ode-overflow-hidden">
            <div className="ode-flex ode-items-center ode-justify-between ode-p-6 ode-border-b">
              <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal">
                Просмотр документа
              </h2>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="ode-text-gray-400 ode-hover:text-gray-600 ode-transition"
              >
                <FaTimes className="ode-text-xl" />
              </button>
            </div>
            
            <div className="ode-p-6">
              <div className="ode-space-y-4">
                <div className="ode-flex ode-items-center ode-gap-4">
                  <div className="ode-w-16 ode-h-16 ode-bg-primary ode-rounded-lg ode-flex ode-items-center ode-justify-center">
                    <FaFileAlt className="ode-text-white ode-text-2xl" />
                  </div>
                  <div>
                    <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal">
                      {selectedDocument.name}
                    </h3>
                    <p className="ode-text-gray">
                      {getDocumentTypeText(selectedDocument.type)} • {formatDate(selectedDocument.uploadedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="ode-bg-gray-50 ode-p-4 ode-rounded-lg">
                  <p className="ode-text-sm ode-text-gray">
                    Статус: <span style={{ color: getStatusColor(selectedDocument.status) }}>
                      {getStatusText(selectedDocument.status)}
                    </span>
                  </p>
                </div>
                
                <div className="ode-bg-gray-100 ode-p-4 ode-rounded-lg">
                  <p className="ode-text-sm ode-text-gray ode-text-center">
                    Здесь будет отображаться содержимое документа
                  </p>
                </div>
                
                <div className="ode-flex ode-items-center ode-gap-2">
                  <button className="ode-btn ode-btn-primary">
                    <FaDownload className="ode-mr-2" />
                    Скачать
                  </button>
                  <button className="ode-btn ode-btn-secondary">
                    <FaEdit className="ode-mr-2" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(selectedDocument.id)}
                    className="ode-btn ode-btn-danger"
                  >
                    <FaTrash className="ode-mr-2" />
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default KYCPage
