import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaDollarSign, FaComment, FaCheck, FaHome, FaArrowLeft } from 'react-icons/fa'

const InvestorContactPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    investment_interest: '',
    message: ''
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
      <div className="ode-bg-gray" style={{ minHeight: '100vh', padding: '80px 0' }}>
        <div className="ode-container" style={{ maxWidth: '600px' }}>
          <div className="ode-card ode-text-center">
            <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <FaCheck style={{ width: '32px', height: '32px', color: '#16a34a' }} />
            </div>
            <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-4">
              Заявка отправлена!
            </h1>
            <p className="ode-text-lg ode-text-gray ode-mb-8">
              Спасибо за ваш интерес к инвестиционным возможностям. Наш эксперт свяжется с вами в течение 2 часов.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/')}
                className="ode-btn ode-btn-primary"
              >
                <FaHome style={{ marginRight: '8px' }} />
                На главную
              </button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="ode-btn ode-btn-secondary"
              >
                <FaArrowLeft style={{ marginRight: '8px' }} />
                Отправить еще
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div className="ode-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
            <div>
              <h1 className="ode-text-3xl ode-font-bold ode-text-charcoal">Инвестиционные возможности</h1>
              <p className="ode-text-gray">Свяжитесь с нами для обсуждения инвестиционных возможностей</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => navigate('/')}
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
        <div className="ode-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'flex-start' }}>
          {/* Form */}
          <div className="ode-card">
            <h2 className="ode-text-2xl ode-font-semibold ode-text-charcoal ode-mb-6">Запросить консультацию</h2>
            
            <form onSubmit={handleSubmit} className="ode-space-y-4">
              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                  <FaUser style={{ marginRight: '8px', display: 'inline' }} />
                  Полное имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Введите ваше полное имя"
                  required
                />
              </div>

              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                  <FaEnvelope style={{ marginRight: '8px', display: 'inline' }} />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                  <FaPhone style={{ marginRight: '8px', display: 'inline' }} />
                  Телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>

              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                  <FaBuilding style={{ marginRight: '8px', display: 'inline' }} />
                  Компания
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Название вашей компании"
                />
              </div>

              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                  <FaDollarSign style={{ marginRight: '8px', display: 'inline' }} />
                  Интерес к инвестициям *
                </label>
                <select
                  name="investment_interest"
                  value={formData.investment_interest}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Выберите тип инвестиций</option>
                  <option value="commercial">Коммерческая недвижимость</option>
                  <option value="residential">Жилая недвижимость</option>
                  <option value="mixed">Смешанные инвестиции</option>
                  <option value="development">Развитие проектов</option>
                </select>
              </div>

              <div>
                <label className="ode-text-sm ode-font-medium ode-text-charcoal ode-mb-2" style={{ display: 'block' }}>
                  <FaComment style={{ marginRight: '8px', display: 'inline' }} />
                  Дополнительная информация
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Расскажите о ваших инвестиционных целях и предпочтениях..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="ode-btn ode-btn-primary"
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div>
            <div className="ode-card ode-mb-6">
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">Почему выбирают нас?</h3>
              <div className="ode-space-y-4">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <FaCheck style={{ width: '12px', height: '12px', color: '#16a34a' }} />
                  </div>
                  <div>
                    <h4 className="ode-text-md ode-font-semibold ode-text-charcoal ode-mb-1">Проверенные объекты</h4>
                    <p className="ode-text-sm ode-text-gray">Тщательно отобранные объекты с высоким потенциалом доходности</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <FaCheck style={{ width: '12px', height: '12px', color: '#16a34a' }} />
                  </div>
                  <div>
                    <h4 className="ode-text-md ode-font-semibold ode-text-charcoal ode-mb-1">Экспертная поддержка</h4>
                    <p className="ode-text-sm ode-text-gray">Профессиональная команда аналитиков и консультантов</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <FaCheck style={{ width: '12px', height: '12px', color: '#16a34a' }} />
                  </div>
                  <div>
                    <h4 className="ode-text-md ode-font-semibold ode-text-charcoal ode-mb-1">Прозрачность</h4>
                    <p className="ode-text-sm ode-text-gray">Полная прозрачность всех операций и отчетности</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ode-card">
              <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-4">Наши преимущества</h3>
              <div className="ode-space-y-3">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <span className="ode-text-sm ode-font-medium">Средняя доходность</span>
                  <span className="ode-text-sm ode-font-semibold ode-text-success">12-15% годовых</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <span className="ode-text-sm ode-font-medium">Минимальная сумма</span>
                  <span className="ode-text-sm ode-font-semibold ode-text-primary">₽1,000,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <span className="ode-text-sm ode-font-medium">Срок инвестиций</span>
                  <span className="ode-text-sm ode-font-semibold ode-text-accent">3-5 лет</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorContactPage