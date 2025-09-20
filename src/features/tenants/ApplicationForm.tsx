import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FaSpinner, FaCheck, FaTimes, FaUser, FaBuilding, FaPhone, FaEnvelope, FaFileAlt, FaLink, FaStickyNote } from 'react-icons/fa'
import type { TenantApplicationFormData } from '../../types/tenant-application'
import { submitTenantApplication, submitTenantApplicationDemo } from '../../lib/tenant-api'
import { useAuthStore } from '../../store/authStore'

// Validation schema
const schema = yup.object({
  full_name: yup.string().required('Имя и фамилия обязательны').min(2, 'Минимум 2 символа'),
  brand_name: yup.string().required('Название бренда обязательно').min(2, 'Минимум 2 символа'),
  phone_number: yup.string().required('Номер телефона обязателен').matches(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, 'Некорректный формат номера'),
  email: yup.string().required('Email обязателен').email('Некорректный формат email'),
  concept_description: yup.string().max(1000, 'Максимум 1000 символов'),
  presentation_url: yup.string().url('Некорректный формат ссылки'),
  notes: yup.string().max(500, 'Максимум 500 символов')
})

interface ApplicationFormProps {
  onSuccess?: (applicationId: string) => void
  onError?: (error: string) => void
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  
  const { accessToken } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TenantApplicationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      brand_name: '',
      phone_number: '',
      email: '',
      concept_description: '',
      presentation_url: '',
      notes: ''
    }
  })

  const onSubmit = async (data: TenantApplicationFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      // Check if user is authenticated
      if (!accessToken) {
        throw new Error('Для отправки заявки необходимо войти в систему')
      }
      
      // Check if we're in demo mode (no backend URL)
      const isDemoMode = !import.meta.env.VITE_AUTH_API_URL && window.location.hostname === 'localhost'
      
      const result = isDemoMode 
        ? await submitTenantApplicationDemo(data)
        : await submitTenantApplication(data, accessToken)

      setSubmitStatus('success')
      setSubmitMessage(result.message || 'Заявка успешно отправлена!')
      
      if (onSuccess && result.application_id) {
        onSuccess(result.application_id)
      }
      
      // Reset form after successful submission
      reset()
    } catch (error) {
      console.error('Error submitting application:', error)
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при отправке заявки'
      setSubmitStatus('error')
      setSubmitMessage(errorMessage)
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="ode-card ode-text-center" style={{ padding: '48px 32px' }}>
        <div className="ode-text-6xl ode-text-success ode-mb-4">
          <FaCheck />
        </div>
        <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal ode-mb-2">
          Заявка отправлена!
        </h2>
        <p className="ode-text-gray ode-mb-6">
          {submitMessage}
        </p>
        <button
          onClick={() => {
            setSubmitStatus('idle')
            setSubmitMessage('')
            reset()
          }}
          className="ode-btn ode-btn-primary"
        >
          Отправить еще одну заявку
        </button>
      </div>
    )
  }

  return (
    <div className="ode-card">
      <div className="ode-mb-6">
        <h2 className="ode-text-2xl ode-font-bold ode-text-charcoal ode-mb-2">
          Подача заявки на аренду
        </h2>
        <p className="ode-text-gray">
          Заполните форму ниже, и мы свяжемся с вами в ближайшее время
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="ode-space-y-6">
        {/* Full Name */}
        <div>
          <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
            <FaUser style={{ marginRight: '8px', display: 'inline' }} />
            Имя и фамилия *
          </label>
          <input
            {...register('full_name')}
            type="text"
            className={`form-input ${errors.full_name ? 'border-red-500' : ''}`}
            placeholder="Введите ваше имя и фамилию"
          />
          {errors.full_name && (
            <p className="ode-text-sm ode-text-red-500 ode-mt-1">{errors.full_name.message}</p>
          )}
        </div>

        {/* Brand Name */}
        <div>
          <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
            <FaBuilding style={{ marginRight: '8px', display: 'inline' }} />
            Название бренда/концепции *
          </label>
          <input
            {...register('brand_name')}
            type="text"
            className={`form-input ${errors.brand_name ? 'border-red-500' : ''}`}
            placeholder="Введите название вашего бренда или концепции"
          />
          {errors.brand_name && (
            <p className="ode-text-sm ode-text-red-500 ode-mt-1">{errors.brand_name.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
            <FaPhone style={{ marginRight: '8px', display: 'inline' }} />
            Номер телефона *
          </label>
          <input
            {...register('phone_number')}
            type="tel"
            className={`form-input ${errors.phone_number ? 'border-red-500' : ''}`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone_number && (
            <p className="ode-text-sm ode-text-red-500 ode-mt-1">{errors.phone_number.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
            <FaEnvelope style={{ marginRight: '8px', display: 'inline' }} />
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="ode-text-sm ode-text-red-500 ode-mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Concept Description */}
        <div>
          <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
            <FaFileAlt style={{ marginRight: '8px', display: 'inline' }} />
            Описание концепции
          </label>
          <textarea
            {...register('concept_description')}
            rows={4}
            className={`form-input ${errors.concept_description ? 'border-red-500' : ''}`}
            placeholder="Кратко опишите вашу концепцию, целевую аудиторию и уникальные особенности"
          />
          {errors.concept_description && (
            <p className="ode-text-sm ode-text-red-500 ode-mt-1">{errors.concept_description.message}</p>
          )}
        </div>

        {/* Presentation URL */}
        <div>
          <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
            <FaLink style={{ marginRight: '8px', display: 'inline' }} />
            Ссылка на презентацию
          </label>
          <input
            {...register('presentation_url')}
            type="url"
            className={`form-input ${errors.presentation_url ? 'border-red-500' : ''}`}
            placeholder="https://drive.google.com/..."
          />
          {errors.presentation_url && (
            <p className="ode-text-sm ode-text-red-500 ode-mt-1">{errors.presentation_url.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
            <FaStickyNote style={{ marginRight: '8px', display: 'inline' }} />
            Дополнительные примечания
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className={`form-input ${errors.notes ? 'border-red-500' : ''}`}
            placeholder="Любая дополнительная информация, которую вы хотели бы сообщить"
          />
          {errors.notes && (
            <p className="ode-text-sm ode-text-red-500 ode-mt-1">{errors.notes.message}</p>
          )}
        </div>

        {/* Submit Status Messages */}
        {submitStatus === 'error' && (
          <div className="alert alert-error">
            <FaTimes style={{ marginRight: '8px' }} />
            {submitMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="ode-text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="ode-btn ode-btn-primary ode-btn-lg"
            style={{ minWidth: '200px' }}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" style={{ marginRight: '8px' }} />
                Отправка...
              </>
            ) : (
              'Отправить заявку'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ApplicationForm
