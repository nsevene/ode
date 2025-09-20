import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaSearch, FaFilter, FaSort, FaEye, FaDownload, FaUpload, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaFileAlt, FaSignature, FaClock, FaCheck, FaTimes, FaExclamationTriangle, FaUser, FaCalendarAlt, FaLock, FaUnlock } from 'react-icons/fa'
import { investorApi, type DocumentSigning } from '../../lib/api/investor'
import InvestorNavigation from '../../components/investors/InvestorNavigation'
import { Helmet } from 'react-helmet-async'
import { format } from 'date-fns'

const DocumentSigningPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [documents, setDocuments] = useState<DocumentSigning[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentSigning[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [selectedDocument, setSelectedDocument] = useState<DocumentSigning | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false)
  const [signature, setSignature] = useState('')
  const [signatureFile, setSignatureFile] = useState<File | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await investorApi.getDocumentSignings()
      setDocuments(data)
      setFilteredDocuments(data)
    } catch (err) {
      console.error('Error fetching document signings:', err)
      setError(t('investor.document_signing.error_fetching'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let currentDocuments = [...documents]

    // Search
    if (searchTerm) {
      currentDocuments = currentDocuments.filter(doc =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      currentDocuments = currentDocuments.filter(doc => doc.status === filterStatus)
    }

    // Filter by type
    if (filterType !== 'all') {
      currentDocuments = currentDocuments.filter(doc => doc.documentType === filterType)
    }

    // Sort
    currentDocuments.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'documentName':
          return a.documentName.localeCompare(b.documentName)
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

    setFilteredDocuments(currentDocuments)
  }, [searchTerm, filterStatus, filterType, sortBy, documents])

  const handleViewDetails = (document: DocumentSigning) => {
    setSelectedDocument(document)
    setIsModalOpen(true)
  }

  const handleSignDocument = (document: DocumentSigning) => {
    setSelectedDocument(document)
    setSignature('')
    setSignatureFile(null)
    setIsSigningModalOpen(true)
  }

  const handleDownloadDocument = async (document: DocumentSigning) => {
    try {
      await investorApi.downloadDocument(document.id)
      alert(t('investor.document_signing.download_success'))
    } catch (err) {
      console.error('Error downloading document:', err)
      alert(t('investor.document_signing.download_error'))
    }
  }

  const handleSignatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDocument) return

    try {
      if (signatureFile) {
        await investorApi.signDocumentWithFile(selectedDocument.id, signatureFile)
      } else if (signature.trim()) {
        await investorApi.signDocumentWithText(selectedDocument.id, signature)
      } else {
        alert(t('investor.document_signing.signature_required'))
        return
      }

      await fetchDocuments()
      setIsSigningModalOpen(false)
      setSelectedDocument(null)
      setSignature('')
      setSignatureFile(null)
      alert(t('investor.document_signing.sign_success'))
    } catch (err) {
      console.error('Error signing document:', err)
      alert(t('investor.document_signing.sign_error'))
    }
  }

  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignatureFile(e.target.files[0])
      setSignature('')
    }
  }

  const getStatusClass = (status: DocumentSigning['status']) => {
    switch (status) {
      case 'signed': return 'ode-badge ode-badge-success'
      case 'pending': return 'ode-badge ode-badge-warning'
      case 'expired': return 'ode-badge ode-badge-error'
      case 'draft': return 'ode-badge ode-badge-info'
      default: return 'ode-badge'
    }
  }

  const getStatusIcon = (status: DocumentSigning['status']) => {
    switch (status) {
      case 'signed': return <FaCheckCircle className="ode-text-green-500" />
      case 'pending': return <FaClock className="ode-text-yellow-500" />
      case 'expired': return <FaTimes className="ode-text-red-500" />
      case 'draft': return <FaFileAlt className="ode-text-blue-500" />
      default: return <FaInfoCircle className="ode-text-gray-500" />
    }
  }

  const getPriorityClass = (priority: DocumentSigning['priority']) => {
    switch (priority) {
      case 'high': return 'ode-text-red-500'
      case 'medium': return 'ode-text-yellow-500'
      case 'low': return 'ode-text-green-500'
      default: return ''
    }
  }

  const getDocumentTypeIcon = (type: DocumentSigning['documentType']) => {
    switch (type) {
      case 'contract': return <FaFileAlt className="ode-mr-1" />
      case 'agreement': return <FaSignature className="ode-mr-1" />
      case 'disclosure': return <FaInfoCircle className="ode-mr-1" />
      case 'legal': return <FaLock className="ode-mr-1" />
      default: return <FaFileAlt className="ode-mr-1" />
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  return (
    <div className="ode-investor-dashboard ode-p-4 sm:ode-p-6 lg:ode-p-8">
      <Helmet>
        <title>{t('investor.document_signing.title')} | ODPortal</title>
        <meta name="description" content={t('investor.document_signing.description')} />
      </Helmet>
      <InvestorNavigation />
      <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-6">{t('investor.document_signing.heading')}</h1>

      <div className="ode-bg-white ode-rounded-lg ode-shadow-md ode-p-6 ode-mb-6">
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-4 ode-gap-4 ode-mb-4">
          <div className="ode-relative">
            <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 -ode-translate-y-1/2 ode-text-gray-400" />
            <input
              type="text"
              placeholder={t('investor.document_signing.search_placeholder')}
              className="ode-input ode-input-bordered ode-w-full ode-pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">{t('investor.document_signing.filter_status')}: {t('all')}</option>
            <option value="pending">{t('investor.document_signing.status_pending')}</option>
            <option value="signed">{t('investor.document_signing.status_signed')}</option>
            <option value="expired">{t('investor.document_signing.status_expired')}</option>
            <option value="draft">{t('investor.document_signing.status_draft')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">{t('investor.document_signing.filter_type')}: {t('all')}</option>
            <option value="contract">{t('investor.document_signing.type_contract')}</option>
            <option value="agreement">{t('investor.document_signing.type_agreement')}</option>
            <option value="disclosure">{t('investor.document_signing.type_disclosure')}</option>
            <option value="legal">{t('investor.document_signing.type_legal')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">{t('investor.document_signing.sort_by')}: {t('investor.document_signing.sort_newest')}</option>
            <option value="documentName">{t('investor.document_signing.sort_by')}: {t('investor.document_signing.sort_name')}</option>
            <option value="dueDate">{t('investor.document_signing.sort_by')}: {t('investor.document_signing.sort_due_date')}</option>
            <option value="priority">{t('investor.document_signing.sort_by')}: {t('investor.document_signing.sort_priority')}</option>
          </select>
        </div>

        <div className="ode-flex ode-justify-between ode-items-center ode-mb-4">
          <span className="ode-text-sm ode-text-gray-600">
            {t('investor.document_signing.found_documents')}: {filteredDocuments.length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-3 ode-gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="ode-card ode-bg-white ode-shadow-md ode-rounded-lg ode-animate-pulse">
              <div className="ode-h-48 ode-bg-gray-200 ode-rounded-t-lg"></div>
              <div className="ode-p-4">
                <div className="ode-h-6 ode-bg-gray-200 ode-rounded ode-mb-2"></div>
                <div className="ode-h-4 ode-bg-gray-200 ode-rounded ode-w-3/4 ode-mb-4"></div>
                <div className="ode-grid ode-grid-cols-2 ode-gap-2">
                  <div className="ode-h-4 ode-bg-gray-200 ode-rounded"></div>
                  <div className="ode-h-4 ode-bg-gray-200 ode-rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="ode-text-center ode-py-12">
          <p className="ode-text-red-500 ode-text-lg ode-mb-4">{error}</p>
          <button className="ode-btn ode-btn-primary" onClick={fetchDocuments}>
            {t('investor.document_signing.retry')}
          </button>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="ode-text-center ode-py-12">
          <FaInfoCircle className="ode-text-gray-300 ode-text-6xl ode-mb-4 ode-mx-auto" />
          <p className="ode-text-gray-500 ode-text-lg ode-mb-2">{t('investor.document_signing.no_documents')}</p>
          <p className="ode-text-gray-400">{t('investor.document_signing.try_different_filters')}</p>
        </div>
      ) : (
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-3 ode-gap-6">
          {filteredDocuments.map(document => (
            <div key={document.id} className="ode-card ode-bg-white ode-shadow-md ode-rounded-lg ode-overflow-hidden">
              <div className="ode-p-4">
                <div className="ode-flex ode-justify-between ode-items-start ode-mb-2">
                  <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">{document.documentName}</h2>
                  <div className="ode-flex ode-items-center">
                    {getStatusIcon(document.status)}
                    <span className={`ode-ml-2 ${getStatusClass(document.status)}`}>
                      {t(`investor.document_signing.status_${document.status}`)}
                    </span>
                  </div>
                </div>
                <div className="ode-flex ode-items-center ode-text-sm ode-text-gray-700 ode-mb-2">
                  {getDocumentTypeIcon(document.documentType)} {t(`investor.document_signing.type_${document.documentType}`)}
                </div>
                {document.propertyName && (
                  <p className="ode-text-gray-600 ode-text-sm ode-mb-2">{document.propertyName}</p>
                )}
                <div className="ode-flex ode-justify-between ode-items-center ode-mb-4">
                  <div className="ode-text-center">
                    <p className={`ode-text-sm ode-font-bold ${getPriorityClass(document.priority)}`}>
                      {t(`investor.document_signing.priority_${document.priority}`)}
                    </p>
                    <p className="ode-text-xs ode-text-gray-500">{t('investor.document_signing.priority')}</p>
                  </div>
                  <div className="ode-text-center">
                    <p className={`ode-text-sm ode-font-bold ${isOverdue(document.dueDate) ? 'ode-text-red-500' : 'ode-text-gray-700'}`}>
                      {format(new Date(document.dueDate), 'dd/MM/yyyy')}
                    </p>
                    <p className="ode-text-xs ode-text-gray-500">{t('investor.document_signing.due_date')}</p>
                  </div>
                </div>
                <div className="ode-flex ode-justify-between ode-items-center">
                  <button className="ode-btn ode-btn-sm ode-btn-info ode-mr-2" onClick={() => handleViewDetails(document)}>
                    <FaEye /> {t('investor.document_signing.view_details')}
                  </button>
                  <button className="ode-btn ode-btn-sm ode-btn-primary" onClick={() => handleDownloadDocument(document)}>
                    <FaDownload /> {t('investor.document_signing.download')}
                  </button>
                </div>
                {document.status === 'pending' && (
                  <button className="ode-btn ode-btn-sm ode-btn-success ode-w-full ode-mt-2" onClick={() => handleSignDocument(document)}>
                    <FaSignature /> {t('investor.document_signing.sign_document')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedDocument && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-5xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('investor.document_signing.modal_title')}</h3>
            <div className="ode-py-4 ode-grid ode-grid-cols-1 md:ode-grid-cols-2 ode-gap-4">
              <div>
                <p><strong>{t('investor.document_signing.document_name')}:</strong> {selectedDocument.documentName}</p>
                <p><strong>{t('investor.document_signing.document_type')}:</strong> {t(`investor.document_signing.type_${selectedDocument.documentType}`)}</p>
                <p><strong>{t('investor.document_signing.status')}:</strong> <span className={getStatusClass(selectedDocument.status)}>{t(`investor.document_signing.status_${selectedDocument.status}`)}</span></p>
                <p><strong>{t('investor.document_signing.priority')}:</strong> <span className={getPriorityClass(selectedDocument.priority)}>{t(`investor.document_signing.priority_${selectedDocument.priority}`)}</span></p>
                <p><strong>{t('investor.document_signing.due_date')}:</strong> {format(new Date(selectedDocument.dueDate), 'dd/MM/yyyy')}</p>
                <p><strong>{t('investor.document_signing.created_at')}:</strong> {format(new Date(selectedDocument.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                {selectedDocument.propertyName && (
                  <p><strong>{t('investor.document_signing.property_name')}:</strong> {selectedDocument.propertyName}</p>
                )}
                {selectedDocument.signedAt && (
                  <p><strong>{t('investor.document_signing.signed_at')}:</strong> {format(new Date(selectedDocument.signedAt), 'dd/MM/yyyy HH:mm')}</p>
                )}
              </div>
              <div>
                <p className="ode-mb-2"><strong>{t('investor.document_signing.description')}:</strong></p>
                <p className="ode-bg-gray-100 ode-p-3 ode-rounded-md ode-mb-4">{selectedDocument.description}</p>
                <p className="ode-mb-2"><strong>{t('investor.document_signing.requirements')}:</strong></p>
                {selectedDocument.requirements && selectedDocument.requirements.length > 0 ? (
                  <ul className="ode-list-disc ode-list-inside ode-mb-4">
                    {selectedDocument.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ode-mb-4">{t('investor.document_signing.no_requirements')}</p>
                )}
                <p className="ode-mb-2"><strong>{t('investor.document_signing.documents')}:</strong></p>
                {selectedDocument.documents && selectedDocument.documents.length > 0 ? (
                  <ul className="ode-list-disc ode-list-inside">
                    {selectedDocument.documents.map((doc, index) => (
                      <li key={index}><a href={doc} target="_blank" rel="noopener noreferrer" className="ode-text-blue-500 hover:ode-underline"><FaDownload className="ode-inline ode-mr-1" /> {t('investor.document_signing.document')} {index + 1}</a></li>
                    ))}
                  </ul>
                ) : (
                  <p>{t('investor.document_signing.no_documents')}</p>
                )}
              </div>
            </div>
            <div className="ode-modal-action">
              <button className="ode-btn ode-btn-primary ode-mr-2" onClick={() => handleDownloadDocument(selectedDocument)}>
                <FaDownload /> {t('investor.document_signing.download')}
              </button>
              {selectedDocument.status === 'pending' && (
                <button className="ode-btn ode-btn-success ode-mr-2" onClick={() => handleSignDocument(selectedDocument)}>
                  <FaSignature /> {t('investor.document_signing.sign_document')}
                </button>
              )}
              <button className="ode-btn" onClick={() => setIsModalOpen(false)}>
                {t('investor.document_signing.close')}
              </button>
            </div>
          </div>
        </dialog>
      )}

      {isSigningModalOpen && selectedDocument && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-3xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('investor.document_signing.signing_modal_title')}</h3>
            <form onSubmit={handleSignatureSubmit} className="ode-py-4">
              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('investor.document_signing.document_name')}</span>
                </label>
                <input type="text" value={selectedDocument.documentName} className="ode-input ode-input-bordered" disabled />
              </div>
              
              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('investor.document_signing.signature_text')}</span>
                </label>
                <textarea
                  className="ode-textarea ode-textarea-bordered ode-h-24"
                  placeholder={t('investor.document_signing.signature_placeholder')}
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  disabled={!!signatureFile}
                ></textarea>
              </div>

              <div className="ode-divider">{t('investor.document_signing.or')}</div>

              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('investor.document_signing.signature_file')}</span>
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleSignatureFileChange}
                  className="ode-file-input ode-file-input-bordered"
                />
                <label className="ode-label">
                  <span className="ode-label-text-alt">{t('investor.document_signing.signature_file_help')}</span>
                </label>
              </div>

              <div className="ode-alert ode-alert-info ode-mb-4">
                <FaInfoCircle />
                <span>{t('investor.document_signing.signature_info')}</span>
              </div>

              <div className="ode-modal-action">
                <button type="submit" className="ode-btn ode-btn-success ode-mr-2" disabled={!signature.trim() && !signatureFile}>
                  <FaSignature /> {t('investor.document_signing.sign_document')}
                </button>
                <button type="button" className="ode-btn" onClick={() => setIsSigningModalOpen(false)}>
                  {t('investor.document_signing.cancel')}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default DocumentSigningPage
