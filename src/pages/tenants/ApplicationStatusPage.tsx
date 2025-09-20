import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaSearch, FaFilter, FaSort, FaEye, FaDownload, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaFileAlt, FaCalendarAlt, FaUser, FaBuilding, FaDollarSign, FaRulerCombined, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaUpload, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'
import { tenantApi, type TenantApplicationForm } from '../../lib/api/tenant'
import TenantNavigation from '../../components/tenants/TenantNavigation'
import { Helmet } from 'react-helmet-async'
import { format } from 'date-fns'

const ApplicationStatusPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [applications, setApplications] = useState<TenantApplicationForm[]>([])
  const [filteredApplications, setFilteredApplications] = useState<TenantApplicationForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterBusinessType, setFilterBusinessType] = useState('all')
  const [sortBy, setSortBy] = useState('submittedAt')
  const [selectedApplication, setSelectedApplication] = useState<TenantApplicationForm | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [currentApplicationData, setCurrentApplicationData] = useState<Partial<TenantApplicationForm>>({})
  const [applicationDocuments, setApplicationDocuments] = useState<FileList | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await tenantApi.getTenantApplications()
      setApplications(data)
      setFilteredApplications(data)
    } catch (err) {
      console.error('Error fetching tenant applications:', err)
      setError(t('tenant.application_status.error_fetching'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let currentApplications = [...applications]

    // Search
    if (searchTerm) {
      currentApplications = currentApplications.filter(app =>
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessDescription.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      currentApplications = currentApplications.filter(app => app.status === filterStatus)
    }

    // Filter by business type
    if (filterBusinessType !== 'all') {
      currentApplications = currentApplications.filter(app => app.businessType === filterBusinessType)
    }

    // Sort
    currentApplications.sort((a, b) => {
      switch (sortBy) {
        case 'submittedAt':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        case 'fullName':
          return a.fullName.localeCompare(b.fullName)
        case 'companyName':
          return a.companyName.localeCompare(b.companyName)
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

    setFilteredApplications(currentApplications)
  }, [searchTerm, filterStatus, filterBusinessType, sortBy, applications])

  const handleViewDetails = (application: TenantApplicationForm) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleCreateApplication = () => {
    setCurrentApplicationData({
      documents: [],
      propertyPreferences: [],
      locationPreferences: []
    })
    setApplicationDocuments(null)
    setIsFormModalOpen(true)
  }

  const handleEditApplication = (application: TenantApplicationForm) => {
    setCurrentApplicationData(application)
    setApplicationDocuments(null)
    setIsFormModalOpen(true)
  }

  const handleDeleteApplication = async (id: string) => {
    if (window.confirm(t('tenant.application_status.confirm_delete'))) {
      try {
        await tenantApi.deleteTenantApplication(id)
        await fetchApplications()
        alert(t('tenant.application_status.delete_success'))
      } catch (err) {
        console.error('Error deleting application:', err)
        alert(t('tenant.application_status.delete_error'))
      }
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let application: TenantApplicationForm
      if (currentApplicationData.id) {
        await tenantApi.updateTenantApplication(currentApplicationData.id, currentApplicationData)
        application = currentApplicationData as TenantApplicationForm
        alert(t('tenant.application_status.update_success'))
      } else {
        application = await tenantApi.createTenantApplication(currentApplicationData)
        alert(t('tenant.application_status.create_success'))
      }

      if (applicationDocuments && applicationDocuments.length > 0) {
        await tenantApi.uploadApplicationDocuments(application.id, Array.from(applicationDocuments))
        alert(t('tenant.application_status.upload_documents_success'))
      }

      await fetchApplications()
      setIsFormModalOpen(false)
      setCurrentApplicationData({})
      setApplicationDocuments(null)
    } catch (err) {
      console.error('Error saving application:', err)
      alert(t('tenant.application_status.save_error'))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'propertyPreferences' || name === 'locationPreferences') {
      setCurrentApplicationData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
      }))
    } else if (name === 'desiredArea' || name === 'budget' || name === 'leaseTerm') {
      setCurrentApplicationData(prev => ({ ...prev, [name]: parseFloat(value) }))
    } else {
      setCurrentApplicationData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setApplicationDocuments(e.target.files)
    }
  }

  const getStatusClass = (status: TenantApplicationForm['status']) => {
    switch (status) {
      case 'approved': return 'ode-badge ode-badge-success'
      case 'pending': return 'ode-badge ode-badge-warning'
      case 'rejected': return 'ode-badge ode-badge-error'
      case 'under_review': return 'ode-badge ode-badge-info'
      default: return 'ode-badge'
    }
  }

  const getStatusIcon = (status: TenantApplicationForm['status']) => {
    switch (status) {
      case 'approved': return <FaCheckCircle className="ode-text-green-500" />
      case 'pending': return <FaClock className="ode-text-yellow-500" />
      case 'rejected': return <FaTimes className="ode-text-red-500" />
      case 'under_review': return <FaSpinner className="ode-text-blue-500" />
      default: return <FaInfoCircle className="ode-text-gray-500" />
    }
  }

  const getPriorityClass = (priority: TenantApplicationForm['priority']) => {
    switch (priority) {
      case 'high': return 'ode-text-red-500'
      case 'medium': return 'ode-text-yellow-500'
      case 'low': return 'ode-text-green-500'
      default: return ''
    }
  }

  const getBusinessTypeIcon = (type: TenantApplicationForm['businessType']) => {
    switch (type) {
      case 'IT': return <FaBuilding className="ode-mr-1" />
      case 'retail': return <FaDollarSign className="ode-mr-1" />
      case 'warehouse': return <FaRulerCombined className="ode-mr-1" />
      case 'office': return <FaFileAlt className="ode-mr-1" />
      case 'restaurant': return <FaUser className="ode-mr-1" />
      default: return <FaBuilding className="ode-mr-1" />
    }
  }

  return (
    <div className="ode-tenant-dashboard ode-p-4 sm:ode-p-6 lg:ode-p-8">
      <Helmet>
        <title>{t('tenant.application_status.title')} | ODPortal</title>
        <meta name="description" content={t('tenant.application_status.description')} />
      </Helmet>
      <TenantNavigation />
      <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-6">{t('tenant.application_status.heading')}</h1>

      <div className="ode-bg-white ode-rounded-lg ode-shadow-md ode-p-6 ode-mb-6">
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-4 ode-gap-4 ode-mb-4">
          <div className="ode-relative">
            <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 -ode-translate-y-1/2 ode-text-gray-400" />
            <input
              type="text"
              placeholder={t('tenant.application_status.search_placeholder')}
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
            <option value="all">{t('tenant.application_status.filter_status')}: {t('all')}</option>
            <option value="pending">{t('tenant.application_status.status_pending')}</option>
            <option value="approved">{t('tenant.application_status.status_approved')}</option>
            <option value="rejected">{t('tenant.application_status.status_rejected')}</option>
            <option value="under_review">{t('tenant.application_status.status_under_review')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={filterBusinessType}
            onChange={(e) => setFilterBusinessType(e.target.value)}
          >
            <option value="all">{t('tenant.application_status.filter_business_type')}: {t('all')}</option>
            <option value="IT">IT</option>
            <option value="retail">{t('tenant.application_status.business_type_retail')}</option>
            <option value="warehouse">{t('tenant.application_status.business_type_warehouse')}</option>
            <option value="office">{t('tenant.application_status.business_type_office')}</option>
            <option value="restaurant">{t('tenant.application_status.business_type_restaurant')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="submittedAt">{t('tenant.application_status.sort_by')}: {t('tenant.application_status.sort_newest')}</option>
            <option value="fullName">{t('tenant.application_status.sort_by')}: {t('tenant.application_status.sort_name')}</option>
            <option value="companyName">{t('tenant.application_status.sort_by')}: {t('tenant.application_status.sort_company')}</option>
            <option value="priority">{t('tenant.application_status.sort_by')}: {t('tenant.application_status.sort_priority')}</option>
          </select>
        </div>

        <div className="ode-flex ode-justify-between ode-items-center ode-mb-4">
          <span className="ode-text-sm ode-text-gray-600">
            {t('tenant.application_status.found_applications')}: {filteredApplications.length}
          </span>
          <button className="ode-btn ode-btn-primary" onClick={handleCreateApplication}>
            <FaPlus /> {t('tenant.application_status.create_new_application')}
          </button>
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
          <button className="ode-btn ode-btn-primary" onClick={fetchApplications}>
            {t('tenant.application_status.retry')}
          </button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="ode-text-center ode-py-12">
          <FaInfoCircle className="ode-text-gray-300 ode-text-6xl ode-mb-4 ode-mx-auto" />
          <p className="ode-text-gray-500 ode-text-lg ode-mb-2">{t('tenant.application_status.no_applications')}</p>
          <p className="ode-text-gray-400">{t('tenant.application_status.try_different_filters')}</p>
        </div>
      ) : (
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-3 ode-gap-6">
          {filteredApplications.map(application => (
            <div key={application.id} className="ode-card ode-bg-white ode-shadow-md ode-rounded-lg ode-overflow-hidden">
              <div className="ode-p-4">
                <div className="ode-flex ode-justify-between ode-items-start ode-mb-2">
                  <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">{application.fullName}</h2>
                  <div className="ode-flex ode-items-center">
                    {getStatusIcon(application.status)}
                    <span className={`ode-ml-2 ${getStatusClass(application.status)}`}>
                      {t(`tenant.application_status.status_${application.status}`)}
                    </span>
                  </div>
                </div>
                <p className="ode-text-gray-600 ode-text-sm ode-mb-2">{application.companyName}</p>
                <div className="ode-flex ode-items-center ode-text-sm ode-text-gray-700 ode-mb-2">
                  {getBusinessTypeIcon(application.businessType)} {application.businessType}
                </div>
                <div className="ode-grid ode-grid-cols-2 ode-gap-2 ode-mb-4">
                  <div className="ode-text-center">
                    <p className="ode-text-lg ode-font-bold ode-text-charcoal">{application.desiredArea} sqm</p>
                    <p className="ode-text-xs ode-text-gray-500">{t('tenant.application_status.desired_area')}</p>
                  </div>
                  <div className="ode-text-center">
                    <p className="ode-text-lg ode-font-bold ode-text-green-600">${application.budget.toLocaleString()}</p>
                    <p className="ode-text-xs ode-text-gray-500">{t('tenant.application_status.budget')}</p>
                  </div>
                </div>
                <div className="ode-flex ode-justify-between ode-items-center">
                  <span className="ode-text-sm ode-text-gray-500">
                    {format(new Date(application.submittedAt), 'dd/MM/yyyy')}
                  </span>
                  <button className="ode-btn ode-btn-sm ode-btn-info" onClick={() => handleViewDetails(application)}>
                    <FaEye /> {t('tenant.application_status.view_details')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedApplication && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-5xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('tenant.application_status.modal_title')}</h3>
            <div className="ode-py-4 ode-grid ode-grid-cols-1 md:ode-grid-cols-2 ode-gap-4">
              <div>
                <p><strong>{t('tenant.application_status.full_name')}:</strong> {selectedApplication.fullName}</p>
                <p><strong>{t('tenant.application_status.company_name')}:</strong> {selectedApplication.companyName}</p>
                <p><strong>{t('tenant.application_status.email')}:</strong> {selectedApplication.email}</p>
                <p><strong>{t('tenant.application_status.phone')}:</strong> {selectedApplication.phone}</p>
                <p><strong>{t('tenant.application_status.business_type')}:</strong> {selectedApplication.businessType}</p>
                <p><strong>{t('tenant.application_status.desired_area')}:</strong> {selectedApplication.desiredArea} sqm</p>
                <p><strong>{t('tenant.application_status.budget')}:</strong> ${selectedApplication.budget.toLocaleString()}</p>
                <p><strong>{t('tenant.application_status.lease_term')}:</strong> {selectedApplication.leaseTerm} {t('tenant.application_status.months')}</p>
                <p><strong>{t('tenant.application_status.status')}:</strong> <span className={getStatusClass(selectedApplication.status)}>{t(`tenant.application_status.status_${selectedApplication.status}`)}</span></p>
                <p><strong>{t('tenant.application_status.priority')}:</strong> <span className={getPriorityClass(selectedApplication.priority)}>{t(`tenant.application_status.priority_${selectedApplication.priority}`)}</span></p>
                <p><strong>{t('tenant.application_status.submitted_at')}:</strong> {format(new Date(selectedApplication.submittedAt), 'dd/MM/yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="ode-mb-2"><strong>{t('tenant.application_status.business_description')}:</strong></p>
                <p className="ode-bg-gray-100 ode-p-3 ode-rounded-md ode-mb-4">{selectedApplication.businessDescription}</p>
                <p className="ode-mb-2"><strong>{t('tenant.application_status.additional_requirements')}:</strong></p>
                <p className="ode-bg-gray-100 ode-p-3 ode-rounded-md ode-mb-4">{selectedApplication.additionalRequirements || t('tenant.application_status.none')}</p>
                <p className="ode-mb-2"><strong>{t('tenant.application_status.property_preferences')}:</strong> {selectedApplication.propertyPreferences.join(', ') || t('tenant.application_status.none')}</p>
                <p className="ode-mb-2"><strong>{t('tenant.application_status.location_preferences')}:</strong> {selectedApplication.locationPreferences.join(', ') || t('tenant.application_status.none')}</p>
                <p className="ode-mb-2"><strong>{t('tenant.application_status.documents')}:</strong></p>
                {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                  <ul className="ode-list-disc ode-list-inside">
                    {selectedApplication.documents.map((doc, index) => (
                      <li key={index}><a href={doc} target="_blank" rel="noopener noreferrer" className="ode-text-blue-500 hover:ode-underline"><FaDownload className="ode-inline ode-mr-1" /> {t('tenant.application_status.document')} {index + 1}</a></li>
                    ))}
                  </ul>
                ) : (
                  <p>{t('tenant.application_status.no_documents')}</p>
                )}
              </div>
            </div>
            <div className="ode-modal-action">
              <button className="ode-btn ode-btn-warning ode-mr-2" onClick={() => handleEditApplication(selectedApplication)}>
                <FaEdit /> {t('tenant.application_status.edit')}
              </button>
              <button className="ode-btn ode-btn-error ode-mr-2" onClick={() => handleDeleteApplication(selectedApplication.id)}>
                <FaTrash /> {t('tenant.application_status.delete')}
              </button>
              <button className="ode-btn" onClick={() => setIsModalOpen(false)}>
                {t('tenant.application_status.close')}
              </button>
            </div>
          </div>
        </dialog>
      )}

      {isFormModalOpen && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-3xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">
              {currentApplicationData.id ? t('tenant.application_status.edit_application') : t('tenant.application_status.create_new_application')}
            </h3>
            <form onSubmit={handleFormSubmit} className="ode-py-4 ode-grid ode-grid-cols-1 md:ode-grid-cols-2 ode-gap-4">
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.full_name')}</span></label>
                <input type="text" name="fullName" value={currentApplicationData.fullName || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.company_name')}</span></label>
                <input type="text" name="companyName" value={currentApplicationData.companyName || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.email')}</span></label>
                <input type="email" name="email" value={currentApplicationData.email || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.phone')}</span></label>
                <input type="text" name="phone" value={currentApplicationData.phone || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.business_type')}</span></label>
                <select name="businessType" value={currentApplicationData.businessType || 'IT'} onChange={handleChange} className="ode-select ode-select-bordered" required>
                  <option value="IT">IT</option>
                  <option value="retail">{t('tenant.application_status.business_type_retail')}</option>
                  <option value="warehouse">{t('tenant.application_status.business_type_warehouse')}</option>
                  <option value="office">{t('tenant.application_status.business_type_office')}</option>
                  <option value="restaurant">{t('tenant.application_status.business_type_restaurant')}</option>
                </select>
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.desired_area')} (sqm)</span></label>
                <input type="number" name="desiredArea" value={currentApplicationData.desiredArea || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.budget')}</span></label>
                <input type="number" name="budget" value={currentApplicationData.budget || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.lease_term')} ({t('tenant.application_status.months')})</span></label>
                <input type="number" name="leaseTerm" value={currentApplicationData.leaseTerm || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.priority')}</span></label>
                <select name="priority" value={currentApplicationData.priority || 'medium'} onChange={handleChange} className="ode-select ode-select-bordered" required>
                  <option value="high">{t('tenant.application_status.priority_high')}</option>
                  <option value="medium">{t('tenant.application_status.priority_medium')}</option>
                  <option value="low">{t('tenant.application_status.priority_low')}</option>
                </select>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.business_description')}</span></label>
                <textarea name="businessDescription" value={currentApplicationData.businessDescription || ''} onChange={handleChange} className="ode-textarea ode-textarea-bordered" required></textarea>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.additional_requirements')}</span></label>
                <textarea name="additionalRequirements" value={currentApplicationData.additionalRequirements || ''} onChange={handleChange} className="ode-textarea ode-textarea-bordered"></textarea>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.property_preferences')} (через запятую)</span></label>
                <textarea name="propertyPreferences" value={currentApplicationData.propertyPreferences?.join(', ') || ''} onChange={handleChange} className="ode-textarea ode-textarea-bordered"></textarea>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.location_preferences')} (через запятую)</span></label>
                <textarea name="locationPreferences" value={currentApplicationData.locationPreferences?.join(', ') || ''} onChange={handleChange} className="ode-textarea ode-textarea-bordered"></textarea>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('tenant.application_status.upload_documents')}</span></label>
                <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleDocumentChange} className="ode-file-input ode-file-input-bordered" />
              </div>
              <div className="ode-modal-action md:col-span-2">
                <button type="submit" className="ode-btn ode-btn-primary ode-mr-2">
                  {currentApplicationData.id ? t('tenant.application_status.save_changes') : t('tenant.application_status.create_application')}
                </button>
                <button type="button" className="ode-btn" onClick={() => setIsFormModalOpen(false)}>
                  {t('tenant.application_status.cancel')}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default ApplicationStatusPage
