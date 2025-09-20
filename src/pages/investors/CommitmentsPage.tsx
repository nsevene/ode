import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaSearch, FaFilter, FaSort, FaEye, FaPlus, FaEdit, FaTrash, FaDownload, FaUpload, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaDollarSign, FaCalendarAlt, FaChartLine, FaFileAlt, FaExclamationTriangle, FaClock, FaCheck, FaTimes } from 'react-icons/fa'
import { investorApi, type InvestmentCommitment } from '../../lib/api/investor'
import InvestorNavigation from '../../components/investors/InvestorNavigation'
import { Helmet } from 'react-helmet-async'
import { format } from 'date-fns'

const CommitmentsPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [commitments, setCommitments] = useState<InvestmentCommitment[]>([])
  const [filteredCommitments, setFilteredCommitments] = useState<InvestmentCommitment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [selectedCommitment, setSelectedCommitment] = useState<InvestmentCommitment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [currentCommitmentData, setCurrentCommitmentData] = useState<Partial<InvestmentCommitment>>({})
  const [commitmentDocuments, setCommitmentDocuments] = useState<FileList | null>(null)

  useEffect(() => {
    fetchCommitments()
  }, [])

  const fetchCommitments = async () => {
    try {
      setLoading(true)
      const data = await investorApi.getInvestmentCommitments()
      setCommitments(data)
      setFilteredCommitments(data)
    } catch (err) {
      console.error('Error fetching investment commitments:', err)
      setError(t('investor.commitments.error_fetching'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let currentCommitments = [...commitments]

    // Search
    if (searchTerm) {
      currentCommitments = currentCommitments.filter(commitment =>
        commitment.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commitment.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commitment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commitment.investmentType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      currentCommitments = currentCommitments.filter(commitment => commitment.status === filterStatus)
    }

    // Filter by type
    if (filterType !== 'all') {
      currentCommitments = currentCommitments.filter(commitment => commitment.investmentType === filterType)
    }

    // Sort
    currentCommitments.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'amount':
          return b.amount - a.amount
        case 'propertyName':
          return a.propertyName.localeCompare(b.propertyName)
        case 'expectedReturn':
          return b.expectedReturn - a.expectedReturn
        default:
          return 0
      }
    })

    setFilteredCommitments(currentCommitments)
  }, [searchTerm, filterStatus, filterType, sortBy, commitments])

  const handleViewDetails = (commitment: InvestmentCommitment) => {
    setSelectedCommitment(commitment)
    setIsModalOpen(true)
  }

  const handleCreateCommitment = () => {
    setCurrentCommitmentData({
      documents: [],
      milestones: [],
      paymentSchedule: []
    })
    setCommitmentDocuments(null)
    setIsFormModalOpen(true)
  }

  const handleEditCommitment = (commitment: InvestmentCommitment) => {
    setCurrentCommitmentData(commitment)
    setCommitmentDocuments(null)
    setIsFormModalOpen(true)
  }

  const handleDeleteCommitment = async (id: string) => {
    if (window.confirm(t('investor.commitments.confirm_delete'))) {
      try {
        await investorApi.deleteInvestmentCommitment(id)
        await fetchCommitments()
        alert(t('investor.commitments.delete_success'))
      } catch (err) {
        console.error('Error deleting commitment:', err)
        alert(t('investor.commitments.delete_error'))
      }
    }
  }

  const handleUpdateStatus = async (id: string, status: InvestmentCommitment['status']) => {
    try {
      await investorApi.updateCommitmentStatus(id, status)
      await fetchCommitments()
      alert(t('investor.commitments.status_update_success'))
    } catch (err) {
      console.error('Error updating status:', err)
      alert(t('investor.commitments.status_update_error'))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let commitment: InvestmentCommitment
      if (currentCommitmentData.id) {
        await investorApi.updateInvestmentCommitment(currentCommitmentData.id, currentCommitmentData)
        commitment = currentCommitmentData as InvestmentCommitment
        alert(t('investor.commitments.update_success'))
      } else {
        commitment = await investorApi.createInvestmentCommitment(currentCommitmentData)
        alert(t('investor.commitments.create_success'))
      }

      if (commitmentDocuments && commitmentDocuments.length > 0) {
        await investorApi.uploadCommitmentDocuments(commitment.id, Array.from(commitmentDocuments))
        alert(t('investor.commitments.upload_documents_success'))
      }

      await fetchCommitments()
      setIsFormModalOpen(false)
      setCurrentCommitmentData({})
      setCommitmentDocuments(null)
    } catch (err) {
      console.error('Error saving commitment:', err)
      alert(t('investor.commitments.save_error'))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'milestones' || name === 'paymentSchedule') {
      setCurrentCommitmentData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
      }))
    } else if (name === 'amount' || name === 'expectedReturn' || name === 'minimumInvestment') {
      setCurrentCommitmentData(prev => ({ ...prev, [name]: parseFloat(value) }))
    } else {
      setCurrentCommitmentData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCommitmentDocuments(e.target.files)
    }
  }

  const getStatusClass = (status: InvestmentCommitment['status']) => {
    switch (status) {
      case 'active': return 'ode-badge ode-badge-success'
      case 'pending': return 'ode-badge ode-badge-warning'
      case 'completed': return 'ode-badge ode-badge-info'
      case 'cancelled': return 'ode-badge ode-badge-error'
      case 'on_hold': return 'ode-badge ode-badge-warning'
      default: return 'ode-badge'
    }
  }

  const getStatusIcon = (status: InvestmentCommitment['status']) => {
    switch (status) {
      case 'active': return <FaCheckCircle className="ode-text-green-500" />
      case 'pending': return <FaClock className="ode-text-yellow-500" />
      case 'completed': return <FaCheck className="ode-text-blue-500" />
      case 'cancelled': return <FaTimes className="ode-text-red-500" />
      case 'on_hold': return <FaExclamationTriangle className="ode-text-orange-500" />
      default: return <FaInfoCircle className="ode-text-gray-500" />
    }
  }

  const getInvestmentTypeIcon = (type: InvestmentCommitment['investmentType']) => {
    switch (type) {
      case 'equity': return <FaChartLine className="ode-mr-1" />
      case 'debt': return <FaDollarSign className="ode-mr-1" />
      case 'hybrid': return <FaFileAlt className="ode-mr-1" />
      default: return <FaFileAlt className="ode-mr-1" />
    }
  }

  return (
    <div className="ode-investor-dashboard ode-p-4 sm:ode-p-6 lg:ode-p-8">
      <Helmet>
        <title>{t('investor.commitments.title')} | ODPortal</title>
        <meta name="description" content={t('investor.commitments.description')} />
      </Helmet>
      <InvestorNavigation />
      <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-6">{t('investor.commitments.heading')}</h1>

      <div className="ode-bg-white ode-rounded-lg ode-shadow-md ode-p-6 ode-mb-6">
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-4 ode-gap-4 ode-mb-4">
          <div className="ode-relative">
            <FaSearch className="ode-absolute ode-left-3 ode-top-1/2 -ode-translate-y-1/2 ode-text-gray-400" />
            <input
              type="text"
              placeholder={t('investor.commitments.search_placeholder')}
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
            <option value="all">{t('investor.commitments.filter_status')}: {t('all')}</option>
            <option value="active">{t('investor.commitments.status_active')}</option>
            <option value="pending">{t('investor.commitments.status_pending')}</option>
            <option value="completed">{t('investor.commitments.status_completed')}</option>
            <option value="cancelled">{t('investor.commitments.status_cancelled')}</option>
            <option value="on_hold">{t('investor.commitments.status_on_hold')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">{t('investor.commitments.filter_type')}: {t('all')}</option>
            <option value="equity">{t('investor.commitments.type_equity')}</option>
            <option value="debt">{t('investor.commitments.type_debt')}</option>
            <option value="hybrid">{t('investor.commitments.type_hybrid')}</option>
          </select>

          <select
            className="ode-select ode-select-bordered ode-w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">{t('investor.commitments.sort_by')}: {t('investor.commitments.sort_newest')}</option>
            <option value="amount">{t('investor.commitments.sort_by')}: {t('investor.commitments.sort_amount')}</option>
            <option value="propertyName">{t('investor.commitments.sort_by')}: {t('investor.commitments.sort_property')}</option>
            <option value="expectedReturn">{t('investor.commitments.sort_by')}: {t('investor.commitments.sort_return')}</option>
          </select>
        </div>

        <div className="ode-flex ode-justify-between ode-items-center ode-mb-4">
          <span className="ode-text-sm ode-text-gray-600">
            {t('investor.commitments.found_commitments')}: {filteredCommitments.length}
          </span>
          <button className="ode-btn ode-btn-primary" onClick={handleCreateCommitment}>
            <FaPlus /> {t('investor.commitments.create_new_commitment')}
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
          <button className="ode-btn ode-btn-primary" onClick={fetchCommitments}>
            {t('investor.commitments.retry')}
          </button>
        </div>
      ) : filteredCommitments.length === 0 ? (
        <div className="ode-text-center ode-py-12">
          <FaInfoCircle className="ode-text-gray-300 ode-text-6xl ode-mb-4 ode-mx-auto" />
          <p className="ode-text-gray-500 ode-text-lg ode-mb-2">{t('investor.commitments.no_commitments')}</p>
          <p className="ode-text-gray-400">{t('investor.commitments.try_different_filters')}</p>
        </div>
      ) : (
        <div className="ode-grid ode-grid-cols-1 md:ode-grid-cols-2 lg:ode-grid-cols-3 ode-gap-6">
          {filteredCommitments.map(commitment => (
            <div key={commitment.id} className="ode-card ode-bg-white ode-shadow-md ode-rounded-lg ode-overflow-hidden">
              <div className="ode-p-4">
                <div className="ode-flex ode-justify-between ode-items-start ode-mb-2">
                  <h2 className="ode-text-xl ode-font-semibold ode-text-charcoal">{commitment.propertyName}</h2>
                  <div className="ode-flex ode-items-center">
                    {getStatusIcon(commitment.status)}
                    <span className={`ode-ml-2 ${getStatusClass(commitment.status)}`}>
                      {t(`investor.commitments.status_${commitment.status}`)}
                    </span>
                  </div>
                </div>
                <p className="ode-text-gray-600 ode-text-sm ode-mb-2">{commitment.propertyAddress}</p>
                <div className="ode-flex ode-items-center ode-text-sm ode-text-gray-700 ode-mb-2">
                  {getInvestmentTypeIcon(commitment.investmentType)} {t(`investor.commitments.type_${commitment.investmentType}`)}
                </div>
                <div className="ode-grid ode-grid-cols-2 ode-gap-2 ode-mb-4">
                  <div className="ode-text-center">
                    <p className="ode-text-2xl ode-font-bold ode-text-charcoal">${commitment.amount.toLocaleString()}</p>
                    <p className="ode-text-xs ode-text-gray-500">{t('investor.commitments.investment_amount')}</p>
                  </div>
                  <div className="ode-text-center">
                    <p className="ode-text-2xl ode-font-bold ode-text-green-600">{commitment.expectedReturn}%</p>
                    <p className="ode-text-xs ode-text-gray-500">{t('investor.commitments.expected_return')}</p>
                  </div>
                </div>
                <div className="ode-flex ode-justify-between ode-items-center">
                  <span className="ode-text-sm ode-text-gray-500">
                    {format(new Date(commitment.createdAt), 'dd/MM/yyyy')}
                  </span>
                  <button className="ode-btn ode-btn-sm ode-btn-info" onClick={() => handleViewDetails(commitment)}>
                    <FaEye /> {t('investor.commitments.view_details')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedCommitment && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-5xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">{t('investor.commitments.modal_title')}</h3>
            <div className="ode-py-4 ode-grid ode-grid-cols-1 md:ode-grid-cols-2 ode-gap-4">
              <div>
                <p><strong>{t('investor.commitments.property_name')}:</strong> {selectedCommitment.propertyName}</p>
                <p><strong>{t('investor.commitments.property_address')}:</strong> {selectedCommitment.propertyAddress}</p>
                <p><strong>{t('investor.commitments.investment_type')}:</strong> {t(`investor.commitments.type_${selectedCommitment.investmentType}`)}</p>
                <p><strong>{t('investor.commitments.investment_amount')}:</strong> ${selectedCommitment.amount.toLocaleString()}</p>
                <p><strong>{t('investor.commitments.expected_return')}:</strong> {selectedCommitment.expectedReturn}%</p>
                <p><strong>{t('investor.commitments.minimum_investment')}:</strong> ${selectedCommitment.minimumInvestment.toLocaleString()}</p>
                <p><strong>{t('investor.commitments.status')}:</strong> <span className={getStatusClass(selectedCommitment.status)}>{t(`investor.commitments.status_${selectedCommitment.status}`)}</span></p>
                <p><strong>{t('investor.commitments.created_at')}:</strong> {format(new Date(selectedCommitment.createdAt), 'dd/MM/yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="ode-mb-2"><strong>{t('investor.commitments.description')}:</strong></p>
                <p className="ode-bg-gray-100 ode-p-3 ode-rounded-md ode-mb-4">{selectedCommitment.description}</p>
                <p className="ode-mb-2"><strong>{t('investor.commitments.milestones')}:</strong></p>
                {selectedCommitment.milestones && selectedCommitment.milestones.length > 0 ? (
                  <ul className="ode-list-disc ode-list-inside ode-mb-4">
                    {selectedCommitment.milestones.map((milestone, index) => (
                      <li key={index}>{milestone}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ode-mb-4">{t('investor.commitments.no_milestones')}</p>
                )}
                <p className="ode-mb-2"><strong>{t('investor.commitments.payment_schedule')}:</strong></p>
                {selectedCommitment.paymentSchedule && selectedCommitment.paymentSchedule.length > 0 ? (
                  <ul className="ode-list-disc ode-list-inside ode-mb-4">
                    {selectedCommitment.paymentSchedule.map((payment, index) => (
                      <li key={index}>{payment}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ode-mb-4">{t('investor.commitments.no_payment_schedule')}</p>
                )}
                <p className="ode-mb-2"><strong>{t('investor.commitments.documents')}:</strong></p>
                {selectedCommitment.documents && selectedCommitment.documents.length > 0 ? (
                  <ul className="ode-list-disc ode-list-inside">
                    {selectedCommitment.documents.map((doc, index) => (
                      <li key={index}><a href={doc} target="_blank" rel="noopener noreferrer" className="ode-text-blue-500 hover:ode-underline"><FaDownload className="ode-inline ode-mr-1" /> {t('investor.commitments.document')} {index + 1}</a></li>
                    ))}
                  </ul>
                ) : (
                  <p>{t('investor.commitments.no_documents')}</p>
                )}
              </div>
            </div>
            <div className="ode-modal-action">
              <button className="ode-btn ode-btn-warning ode-mr-2" onClick={() => handleEditCommitment(selectedCommitment)}>
                <FaEdit /> {t('investor.commitments.edit')}
              </button>
              <button className="ode-btn ode-btn-error ode-mr-2" onClick={() => handleDeleteCommitment(selectedCommitment.id)}>
                <FaTrash /> {t('investor.commitments.delete')}
              </button>
              <button className="ode-btn" onClick={() => setIsModalOpen(false)}>
                {t('investor.commitments.close')}
              </button>
            </div>
          </div>
        </dialog>
      )}

      {isFormModalOpen && (
        <dialog className="ode-modal" open>
          <div className="ode-modal-box ode-w-11/12 ode-max-w-3xl">
            <h3 className="ode-font-bold ode-text-2xl ode-mb-4">
              {currentCommitmentData.id ? t('investor.commitments.edit_commitment') : t('investor.commitments.create_new_commitment')}
            </h3>
            <form onSubmit={handleFormSubmit} className="ode-py-4 ode-grid ode-grid-cols-1 md:ode-grid-cols-2 ode-gap-4">
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.property_name')}</span></label>
                <input type="text" name="propertyName" value={currentCommitmentData.propertyName || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.property_address')}</span></label>
                <input type="text" name="propertyAddress" value={currentCommitmentData.propertyAddress || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.investment_type')}</span></label>
                <select name="investmentType" value={currentCommitmentData.investmentType || 'equity'} onChange={handleChange} className="ode-select ode-select-bordered" required>
                  <option value="equity">{t('investor.commitments.type_equity')}</option>
                  <option value="debt">{t('investor.commitments.type_debt')}</option>
                  <option value="hybrid">{t('investor.commitments.type_hybrid')}</option>
                </select>
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.investment_amount')}</span></label>
                <input type="number" name="amount" value={currentCommitmentData.amount || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.expected_return')} (%)</span></label>
                <input type="number" name="expectedReturn" value={currentCommitmentData.expectedReturn || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.minimum_investment')}</span></label>
                <input type="number" name="minimumInvestment" value={currentCommitmentData.minimumInvestment || ''} onChange={handleChange} className="ode-input ode-input-bordered" required />
              </div>
              <div className="ode-form-control">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.status')}</span></label>
                <select name="status" value={currentCommitmentData.status || 'pending'} onChange={handleChange} className="ode-select ode-select-bordered" required>
                  <option value="active">{t('investor.commitments.status_active')}</option>
                  <option value="pending">{t('investor.commitments.status_pending')}</option>
                  <option value="completed">{t('investor.commitments.status_completed')}</option>
                  <option value="cancelled">{t('investor.commitments.status_cancelled')}</option>
                  <option value="on_hold">{t('investor.commitments.status_on_hold')}</option>
                </select>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.description')}</span></label>
                <textarea name="description" value={currentCommitmentData.description || ''} onChange={handleChange} className="ode-textarea ode-textarea-bordered" required></textarea>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.milestones')} (через запятую)</span></label>
                <textarea name="milestones" value={currentCommitmentData.milestones?.join(', ') || ''} onChange={handleChange} className="ode-textarea ode-textarea-bordered"></textarea>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.payment_schedule')} (через запятую)</span></label>
                <textarea name="paymentSchedule" value={currentCommitmentData.paymentSchedule?.join(', ') || ''} onChange={handleChange} className="ode-textarea ode-textarea-bordered"></textarea>
              </div>
              <div className="ode-form-control md:col-span-2">
                <label className="ode-label"><span className="ode-label-text">{t('investor.commitments.upload_documents')}</span></label>
                <input type="file" multiple accept=".pdf,.doc,.docx" onChange={handleDocumentChange} className="ode-file-input ode-file-input-bordered" />
              </div>
              <div className="ode-modal-action md:col-span-2">
                <button type="submit" className="ode-btn ode-btn-primary ode-mr-2">
                  {currentCommitmentData.id ? t('investor.commitments.save_changes') : t('investor.commitments.create_commitment')}
                </button>
                <button type="button" className="ode-btn" onClick={() => setIsFormModalOpen(false)}>
                  {t('investor.commitments.cancel')}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default CommitmentsPage
