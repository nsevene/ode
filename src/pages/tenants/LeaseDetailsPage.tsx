import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaSearch, FaFilter, FaSort, FaEye, FaDownload, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaFileAlt, FaCalendarAlt, FaUser, FaBuilding, FaDollarSign, FaRulerCombined, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaUpload, FaCheck, FaTimes, FaSpinner, FaHistory, FaReceipt, FaBell, FaExclamationCircle } from 'react-icons/fa'
import { tenantApi, type TenantLease } from '../../lib/api/tenant'
import TenantNavigation from '../../components/tenants/TenantNavigation'
import { Helmet } from 'react-helmet-async'
import { format, differenceInDays, isAfter, isBefore, addDays } from 'date-fns'

const LeaseDetailsPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [leases, setLeases] = useState<TenantLease[]>([])
  const [filteredLeases, setFilteredLeases] = useState<TenantLease[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPropertyType, setFilterPropertyType] = useState('all')
  const [sortBy, setSortBy] = useState('startDate')
  const [selectedLease, setSelectedLease] = useState<TenantLease | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [currentLeaseData, setCurrentLeaseData] = useState<Partial<TenantLease>>({})
  const [leaseDocuments, setLeaseDocuments] = useState<FileList | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    fetchLeases()
  }, [])

  const fetchLeases = async () => {
    try {
      setLoading(true)
      const data = await tenantApi.getTenantLeases()
      setLeases(data)
      setFilteredLeases(data)
    } catch (err) {
      console.error('Error fetching tenant leases:', err)
      setError(t('tenant.lease_details.error_fetching'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let currentLeases = [...leases]

    // Search
    if (searchTerm) {
      currentLeases = currentLeases.filter(lease =>
        lease.lease_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.property?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.property?.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      currentLeases = currentLeases.filter(lease => lease.status === filterStatus)
    }

    // Filter by property type
    if (filterPropertyType !== 'all') {
      currentLeases = currentLeases.filter(lease => lease.property?.type === filterPropertyType)
    }

    // Sort
    currentLeases.sort((a, b) => {
      switch (sortBy) {
        case 'startDate':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        case 'endDate':
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
        case 'monthlyRent':
          return b.monthly_rent - a.monthly_rent
        case 'leaseNumber':
          return a.lease_number.localeCompare(b.lease_number)
        default:
          return 0
      }
    })

    setFilteredLeases(currentLeases)
  }, [searchTerm, filterStatus, filterPropertyType, sortBy, leases])

  const handleViewDetails = (lease: TenantLease) => {
    setSelectedLease(lease)
    setIsModalOpen(true)
  }

  const handleMakePayment = (lease: TenantLease) => {
    setSelectedLease(lease)
    setPaymentAmount(lease.monthly_rent.toString())
    setPaymentMethod('')
    setIsPaymentModalOpen(true)
  }

  const handleViewDocuments = (lease: TenantLease) => {
    setSelectedLease(lease)
    setIsDocumentModalOpen(true)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLease) return

    try {
      await tenantApi.makePayment(selectedLease.id, {
        amount: parseFloat(paymentAmount),
        method: paymentMethod,
        description: `Payment for lease ${selectedLease.lease_number}`
      })
      await fetchLeases()
      setIsPaymentModalOpen(false)
      setSelectedLease(null)
      setPaymentAmount('')
      setPaymentMethod('')
      alert(t('tenant.lease_details.payment_success'))
    } catch (err) {
      console.error('Error making payment:', err)
      alert(t('tenant.lease_details.payment_error'))
    }
  }

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLease || !leaseDocuments) return

    try {
      await tenantApi.uploadLeaseDocuments(selectedLease.id, Array.from(leaseDocuments))
      await fetchLeases()
      setIsDocumentModalOpen(false)
      setSelectedLease(null)
      setLeaseDocuments(null)
      alert(t('tenant.lease_details.upload_success'))
    } catch (err) {
      console.error('Error uploading documents:', err)
      alert(t('tenant.lease_details.upload_error'))
    }
  }

  const getStatusClass = (status: TenantLease['status']) => {
    switch (status) {
      case 'active': return 'ode-badge ode-badge-success'
      case 'expired': return 'ode-badge ode-badge-error'
      case 'terminated': return 'ode-badge ode-badge-warning'
      default: return 'ode-badge'
    }
  }

  const getStatusIcon = (status: TenantLease['status']) => {
    switch (status) {
      case 'active': return <FaCheckCircle className="ode-text-green-500" />
      case 'expired': return <FaTimes className="ode-text-red-500" />
      case 'terminated': return <FaExclamationTriangle className="ode-text-orange-500" />
      default: return <FaInfoCircle className="ode-text-gray-500" />
    }
  }

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'office': return <FaBuilding className="ode-mr-1" />
      case 'retail': return <FaDollarSign className="ode-mr-1" />
      case 'warehouse': return <FaRulerCombined className="ode-mr-1" />
      case 'coworking': return <FaUser className="ode-mr-1" />
      default: return <FaBuilding className="ode-mr-1" />
    }
  }

  const getLeaseStatus = (lease: TenantLease) => {
    const now = new Date()
    const startDate = new Date(lease.start_date)
    const endDate = new Date(lease.end_date)
    const daysUntilExpiry = differenceInDays(endDate, now)

    if (lease.status === 'terminated') {
      return { status: 'terminated', message: t('tenant.lease_details.status_terminated'), color: 'ode-text-red-500' }
    }

    if (lease.status === 'expired') {
      return { status: 'expired', message: t('tenant.lease_details.status_expired'), color: 'ode-text-red-500' }
    }

    if (isBefore(endDate, now)) {
      return { status: 'expired', message: t('tenant.lease_details.status_expired'), color: 'ode-text-red-500' }
    }

    if (daysUntilExpiry <= 30) {
      return { status: 'expiring', message: t('tenant.lease_details.status_expiring_soon'), color: 'ode-text-orange-500' }
    }

    if (isAfter(now, startDate)) {
      return { status: 'active', message: t('tenant.lease_details.status_active'), color: 'ode-text-green-500' }
    }

    return { status: 'pending', message: t('tenant.lease_details.status_pending'), color: 'ode-text-blue-500' }
  }

  const getDaysUntilExpiry = (endDate: string) => {
    const now = new Date()
    const expiry = new Date(endDate)
    return differenceInDays(expiry, now)
  }

  return (
    <div className="ode-tenant-dashboard ode-p-4 sm:ode-p-6 lg:ode-p-8">
      <Helmet>
        <title>{t('tenant.lease_details.title')} | ODPortal</title>
        <meta name="description" content={t('tenant.lease_details.description')} />
      </Helmet>
      <TenantNavigation />
      <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-6">{t('tenant.lease_details.heading')}</h1>

      <div className="ode-bg-white ode-rounded-lg ode-shadow-md ode-p-6 ode-mb-6">
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-4 ode-gap-4 ode-mb-4">
          <div className="ode-relative">
            <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 -ode-translate-y-1/2 ode-text-gray-400" />
            <input
              type="text"
              placeholder={t('tenant.lease_details.search_placeholder')}
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
            <option value="all">{t('tenant.lease_details.filter_status')}: {t('all')}</option>
            <option value="active">{t('tenant.lease_details.status_active')}</option>
            <option value="expired">{t('tenant.lease_details.status_expired')}</option>
            <option value="terminated">{t('tenant.lease_details.status_terminated')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={filterPropertyType}
            onChange={(e) => setFilterPropertyType(e.target.value)}
          >
            <option value="all">{t('tenant.lease_details.filter_property_type')}: {t('all')}</option>
            <option value="office">{t('tenant.lease_details.property_type_office')}</option>
            <option value="retail">{t('tenant.lease_details.property_type_retail')}</option>
            <option value="warehouse">{t('tenant.lease_details.property_type_warehouse')}</option>
            <option value="coworking">{t('tenant.lease_details.property_type_coworking')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="startDate">{t('tenant.lease_details.sort_by')}: {t('tenant.lease_details.sort_start_date')}</option>
            <option value="endDate">{t('tenant.lease_details.sort_by')}: {t('tenant.lease_details.sort_end_date')}</option>
            <option value="monthlyRent">{t('tenant.lease_details.sort_by')}: {t('tenant.lease_details.sort_rent')}</option>
            <option value="leaseNumber">{t('tenant.lease_details.sort_by')}: {t('tenant.lease_details.sort_lease_number')}</option>
          </select>
        </div>

        <div className="ode-flex ode-justify-between ode-items-center ode-mb-4">
          <span className="ode-text-sm ode-text-gray-600">
            {t('tenant.lease_details.found_leases')}: {filteredLeases.length}
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
          <button className="ode-btn ode-btn-primary" onClick={fetchLeases}>
            {t('tenant.lease_details.retry')}
          </button>
        </div>
      ) : filteredLeases.length === 0 ? (
        <div className="ode-text-center ode-py-12">
          <FaInfoCircle className="ode-text-gray-300 ode-text-6xl ode-mb-4 ode-mx-auto" />
          <p className="ode-text-gray-500 ode-text-lg ode-mb-2">{t('tenant.lease_details.no_leases')}</p>
          <p className="ode-text-gray-400">{t('tenant.lease_details.try_different_filters')}</p>
        </div>
      ) : (
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-3 ode-gap-6">
          {filteredLeases.map(lease => {
            const leaseStatus = getLeaseStatus(lease)
            const daysUntilExpiry = getDaysUntilExpiry(lease.end_date)
            
            return (
              <div key={lease.id} className="ode-card ode-bg-white ode-shadow-md ode-rounded-lg ode-overflow-hidden">
                <div className="ode-p-4">
                  <div className="ode-flex ode-justify-between ode-items-start ode-mb-2">
                    <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">{lease.lease_number}</h2>
                    <div className="ode-flex ode-items-center">
                      {getStatusIcon(lease.status)}
                      <span className={`ode-ml-2 ${getStatusClass(lease.status)}`}>
                        {t(`tenant.lease_details.status_${lease.status}`)}
                      </span>
                    </div>
                  </div>
                  <p className="ode-text-gray-600 ode-text-sm ode-mb-2">{lease.property?.name}</p>
                  <p className="ode-text-gray-500 ode-text-xs ode-mb-2">{lease.property?.address}</p>
                  <div className="ode-flex ode-items-center ode-text-sm ode-text-gray-700 ode-mb-2">
                    {getPropertyTypeIcon(lease.property?.type || '')} {lease.property?.type}
                  </div>
                  <div className="ode-grid ode-grid-cols-2 ode-gap-2 ode-mb-4">
                    <div className="ode-text-center">
                      <p className="ode-text-lg ode-font-bold ode-text-charcoal">${lease.monthly_rent.toLocaleString()}</p>
                      <p className="ode-text-xs ode-text-gray-500">{t('tenant.lease_details.monthly_rent')}</p>
                    </div>
                    <div className="ode-text-center">
                      <p className="ode-text-lg ode-font-bold ode-text-green-600">{lease.property?.size} sqm</p>
                      <p className="ode-text-xs ode-text-gray-500">{t('tenant.lease_details.area')}</p>
                    </div>
                  </div>
                  <div className="ode-flex ode-justify-between ode-items-center ode-mb-2">
                    <span className="ode-text-sm ode-text-gray-500">
                      {format(new Date(lease.start_date), 'dd/MM/yyyy')} - {format(new Date(lease.end_date), 'dd/MM/yyyy')}
                    </span>
                    <span className={`ode-text-sm ode-font-medium ${leaseStatus.color}`}>
                      {leaseStatus.message}
                    </span>
                  </div>
                  {daysUntilExpiry > 0 && daysUntilExpiry <= 30 && (
                    <div className="ode-alert ode-alert-warning ode-mb-2">
                      <FaExclamationCircle />
                      <span>{t('tenant.lease_details.expires_in', { days: daysUntilExpiry })}</span>
                    </div>
                  )}
                  <div className="ode-flex ode-justify-between ode-items-center">
                    <button className="ode-btn ode-btn-sm ode-btn-info ode-mr-2" onClick={() => handleViewDetails(lease)}>
                      <FaEye /> {t('tenant.lease_details.view_details')}
                    </button>
                    <button className="ode-btn ode-btn-sm ode-btn-primary" onClick={() => handleMakePayment(lease)}>
                      <FaReceipt /> {t('tenant.lease_details.make_payment')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {isModalOpen && selectedLease && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-5xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('tenant.lease_details.modal_title')}</h3>
            <div className="ode-py-4 ode-grid ode-grid-cols-1 md:ode-grid-cols-2 ode-gap-4">
              <div>
                <p><strong>{t('tenant.lease_details.lease_number')}:</strong> {selectedLease.lease_number}</p>
                <p><strong>{t('tenant.lease_details.property_name')}:</strong> {selectedLease.property?.name}</p>
                <p><strong>{t('tenant.lease_details.property_address')}:</strong> {selectedLease.property?.address}</p>
                <p><strong>{t('tenant.lease_details.property_type')}:</strong> {selectedLease.property?.type}</p>
                <p><strong>{t('tenant.lease_details.property_size')}:</strong> {selectedLease.property?.size} sqm</p>
                <p><strong>{t('tenant.lease_details.start_date')}:</strong> {format(new Date(selectedLease.start_date), 'dd/MM/yyyy')}</p>
                <p><strong>{t('tenant.lease_details.end_date')}:</strong> {format(new Date(selectedLease.end_date), 'dd/MM/yyyy')}</p>
                <p><strong>{t('tenant.lease_details.monthly_rent')}:</strong> ${selectedLease.monthly_rent.toLocaleString()}</p>
                <p><strong>{t('tenant.lease_details.deposit')}:</strong> ${selectedLease.deposit.toLocaleString()}</p>
                <p><strong>{t('tenant.lease_details.status')}:</strong> <span className={getStatusClass(selectedLease.status)}>{t(`tenant.lease_details.status_${selectedLease.status}`)}</span></p>
              </div>
              <div>
                <p className="ode-mb-2"><strong>{t('tenant.lease_details.terms')}:</strong></p>
                <p className="ode-bg-gray-100 ode-p-3 ode-rounded-md ode-mb-4">{selectedLease.terms}</p>
                <p className="ode-mb-2"><strong>{t('tenant.lease_details.documents')}:</strong></p>
                {selectedLease.documents && selectedLease.documents.length > 0 ? (
                  <ul className="ode-list-disc ode-list-inside ode-mb-4">
                    {selectedLease.documents.map((doc, index) => (
                      <li key={index}><a href={doc} target="_blank" rel="noopener noreferrer" className="ode-text-blue-500 hover:ode-underline"><FaDownload className="ode-inline ode-mr-1" /> {t('tenant.lease_details.document')} {index + 1}</a></li>
                    ))}
                  </ul>
                ) : (
                  <p className="ode-mb-4">{t('tenant.lease_details.no_documents')}</p>
                )}
                <p className="ode-mb-2"><strong>{t('tenant.lease_details.payment_history')}:</strong></p>
                {selectedLease.payment_history && selectedLease.payment_history.length > 0 ? (
                  <div className="ode-overflow-x-auto">
                    <table className="ode-table ode-w-full ode-table-compact">
                      <thead>
                        <tr>
                          <th>{t('tenant.lease_details.payment_date')}</th>
                          <th>{t('tenant.lease_details.payment_amount')}</th>
                          <th>{t('tenant.lease_details.payment_status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLease.payment_history.map((payment, index) => (
                          <tr key={index}>
                            <td>{format(new Date(payment.date), 'dd/MM/yyyy')}</td>
                            <td>${payment.amount.toLocaleString()}</td>
                            <td>{payment.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>{t('tenant.lease_details.no_payment_history')}</p>
                )}
              </div>
            </div>
            <div className="ode-modal-action">
              <button className="ode-btn ode-btn-primary ode-mr-2" onClick={() => handleViewDocuments(selectedLease)}>
                <FaFileAlt /> {t('tenant.lease_details.view_documents')}
              </button>
              <button className="ode-btn ode-btn-success ode-mr-2" onClick={() => handleMakePayment(selectedLease)}>
                <FaReceipt /> {t('tenant.lease_details.make_payment')}
              </button>
              <button className="ode-btn" onClick={() => setIsModalOpen(false)}>
                {t('tenant.lease_details.close')}
              </button>
            </div>
          </div>
        </dialog>
      )}

      {isPaymentModalOpen && selectedLease && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-2xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('tenant.lease_details.payment_modal_title')}</h3>
            <form onSubmit={handlePaymentSubmit} className="ode-py-4">
              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('tenant.lease_details.lease_number')}</span>
                </label>
                <input type="text" value={selectedLease.lease_number} className="ode-input ode-input-bordered" disabled />
              </div>
              
              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('tenant.lease_details.payment_amount')}</span>
                </label>
                <input
                  type="number"
                  className="ode-input ode-input-bordered"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>

              <div className="ode-form-control ode-mb-4">
                <label className="ode-label">
                  <span className="ode-label-text">{t('tenant.lease_details.payment_method')}</span>
                </label>
                <select
                  className="ode-select ode-select-bordered"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">{t('tenant.lease_details.select_payment_method')}</option>
                  <option value="bank_transfer">{t('tenant.lease_details.bank_transfer')}</option>
                  <option value="credit_card">{t('tenant.lease_details.credit_card')}</option>
                  <option value="debit_card">{t('tenant.lease_details.debit_card')}</option>
                  <option value="online_payment">{t('tenant.lease_details.online_payment')}</option>
                </select>
              </div>

              <div className="ode-alert ode-alert-info ode-mb-4">
                <FaInfoCircle />
                <span>{t('tenant.lease_details.payment_info')}</span>
              </div>

              <div className="ode-modal-action">
                <button type="submit" className="ode-btn ode-btn-success ode-mr-2">
                  <FaReceipt /> {t('tenant.lease_details.submit_payment')}
                </button>
                <button type="button" className="ode-btn" onClick={() => setIsPaymentModalOpen(false)}>
                  {t('tenant.lease_details.cancel')}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {isDocumentModalOpen && selectedLease && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-3xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('tenant.lease_details.documents_modal_title')}</h3>
            <div className="ode-py-4">
              <div className="ode-mb-4">
                <h4 className="ode-font-semibold ode-mb-2">{t('tenant.lease_details.existing_documents')}</h4>
                {selectedLease.documents && selectedLease.documents.length > 0 ? (
                  <ul className="ode-list-disc ode-list-inside">
                    {selectedLease.documents.map((doc, index) => (
                      <li key={index} className="ode-mb-2">
                        <a href={doc} target="_blank" rel="noopener noreferrer" className="ode-text-blue-500 hover:ode-underline">
                          <FaDownload className="ode-inline ode-mr-1" /> {t('tenant.lease_details.document')} {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t('tenant.lease_details.no_documents')}</p>
                )}
              </div>

              <form onSubmit={handleDocumentUpload} className="ode-mt-4">
                <div className="ode-form-control ode-mb-4">
                  <label className="ode-label">
                    <span className="ode-label-text">{t('tenant.lease_details.upload_new_documents')}</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setLeaseDocuments(e.target.files)}
                    className="ode-file-input ode-file-input-bordered"
                  />
                </div>

                <div className="ode-modal-action">
                  <button type="submit" className="ode-btn ode-btn-primary ode-mr-2" disabled={!leaseDocuments}>
                    <FaUpload /> {t('tenant.lease_details.upload_documents')}
                  </button>
                  <button type="button" className="ode-btn" onClick={() => setIsDocumentModalOpen(false)}>
                    {t('tenant.lease_details.close')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default LeaseDetailsPage
