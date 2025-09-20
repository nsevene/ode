import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBuilding, FaUser, FaEnvelope, FaPhone, FaFileAlt, FaCheck } from 'react-icons/fa'

const TenantApplicationPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    business_type: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
        <div className="ode-container" style={{ padding: '80px 0' }}>
          <div className="ode-card ode-text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="ode-text-6xl ode-text-success ode-mb-4">
              <FaCheck />
            </div>
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-4">
              Заявка отправлена!
            </h1>
            <p className="ode-text-lg ode-text-gray ode-mb-8">
              Спасибо за ваш интерес к платформе ODPortal. Мы свяжемся с вами в течение 24 часов.
            </p>
            <div className="ode-space-y-4">
              <button 
                onClick={() => navigate('/')}
                className="ode-btn ode-btn-primary"
              >
                Вернуться на главную
              </button>
              <button 
                onClick={() => navigate('/demo')}
                className="ode-btn ode-btn-secondary"
              >
                Посмотреть демо
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      <div className="ode-container" style={{ padding: '80px 0' }}>
        <div className="ode-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="ode-text-center ode-mb-8">
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-4">
              Стать арендатором
            </h1>
            <p className="ode-text-lg ode-text-gray">
              Подайте заявку и получите доступ к лучшим предложениям на рынке коммерческой недвижимости
            </p>
          </div>

          <form onSubmit={handleSubmit} className="ode-space-y-6">
            {/* Company Information */}
            <div>
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Информация о компании</h3>
              <div className="ode-space-y-4">
                <div>
                  <label htmlFor="company_name" className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                    <FaBuilding style={{ marginRight: '8px', display: 'inline' }} />
                    Название компании *
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="ООО 'Название компании'"
                  />
                </div>

                <div>
                  <label htmlFor="business_type" className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                    Тип деятельности *
                  </label>
                  <select
                    id="business_type"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Выберите тип деятельности</option>
                    <option value="it">IT и технологии</option>
                    <option value="finance">Финансы и банки</option>
                    <option value="retail">Розничная торговля</option>
                    <option value="services">Услуги</option>
                    <option value="manufacturing">Производство</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Контактная информация</h3>
              <div className="ode-space-y-4">
                <div>
                  <label htmlFor="contact_name" className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                    <FaUser style={{ marginRight: '8px', display: 'inline' }} />
                    ФИО контактного лица *
                  </label>
                  <input
                    type="text"
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Иванов Иван Иванович"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                    <FaEnvelope style={{ marginRight: '8px', display: 'inline' }} />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="contact@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                    <FaPhone style={{ marginRight: '8px', display: 'inline' }} />
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-4">Дополнительная информация</h3>
              <div>
                <label htmlFor="description" className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                  <FaFileAlt style={{ marginRight: '8px', display: 'inline' }} />
                  Описание проекта
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-input"
                  placeholder="Расскажите о вашем проекте, требованиях к помещению и планах развития..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="ode-text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="ode-btn ode-btn-primary ode-btn-lg"
                style={{ minWidth: '200px' }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TenantApplicationPage