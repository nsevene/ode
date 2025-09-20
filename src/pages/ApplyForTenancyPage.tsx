import React from 'react'
import { Helmet } from 'react-helmet-async'
import ApplicationForm from '../features/tenants/ApplicationForm'
import { FaHandshake, FaClock, FaCheckCircle, FaUsers } from 'react-icons/fa'

const ApplyForTenancyPage: React.FC = () => {
  const handleSuccess = (applicationId: string) => {
    console.log('Application submitted successfully:', applicationId)
  }

  const handleError = (error: string) => {
    console.error('Application submission error:', error)
  }

  return (
    <>
      <Helmet>
        <title>Подача заявки на аренду | ODE Portal</title>
        <meta name="description" content="Подайте заявку на аренду коммерческого помещения в ODE Portal. Быстрое рассмотрение и выгодные условия." />
      </Helmet>

      <div className="ode-bg-gray" style={{ minHeight: '100vh' }}>
        {/* Header */}
        <div className="ode-bg-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div className="ode-container">
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <h1 className="ode-text-4xl ode-font-bold ode-text-charcoal ode-mb-4">
                Подача заявки на аренду
              </h1>
              <p className="ode-text-lg ode-text-gray ode-max-w-2xl" style={{ margin: '0 auto' }}>
                Станьте частью нашего торгового сообщества. Заполните форму ниже, 
                и мы свяжемся с вами для обсуждения условий аренды.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="ode-container" style={{ padding: '64px 0' }}>
          <div className="ode-grid ode-grid-4" style={{ marginBottom: '48px' }}>
            <div className="ode-card ode-text-center">
              <div className="ode-text-4xl ode-text-primary ode-mb-4">
                <FaHandshake />
              </div>
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">
                Выгодные условия
              </h3>
              <p className="ode-text-sm ode-text-gray">
                Конкурентные цены и гибкие условия аренды
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div className="ode-text-4xl ode-text-primary ode-mb-4">
                <FaClock />
              </div>
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">
                Быстрое рассмотрение
              </h3>
              <p className="ode-text-sm ode-text-gray">
                Ответ в течение 2-3 рабочих дней
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div className="ode-text-4xl ode-text-primary ode-mb-4">
                <FaCheckCircle />
              </div>
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">
                Простая процедура
              </h3>
              <p className="ode-text-sm ode-text-gray">
                Минимум документов и формальностей
              </p>
            </div>

            <div className="ode-card ode-text-center">
              <div className="ode-text-4xl ode-text-primary ode-mb-4">
                <FaUsers />
              </div>
              <h3 className="ode-text-lg ode-font-semibold ode-text-charcoal ode-mb-2">
                Поддержка
              </h3>
              <p className="ode-text-sm ode-text-gray">
                Помощь в развитии вашего бизнеса
              </p>
            </div>
          </div>

          {/* Application Form */}
          <ApplicationForm 
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        {/* Additional Information */}
        <div className="ode-bg-white" style={{ padding: '64px 0' }}>
          <div className="ode-container">
            <div className="ode-text-center ode-mb-8">
              <h2 className="ode-text-3xl ode-font-bold ode-text-charcoal ode-mb-4">
                Что происходит после подачи заявки?
              </h2>
            </div>

            <div className="ode-grid ode-grid-3">
              <div className="ode-text-center">
                <div className="ode-text-6xl ode-text-primary ode-mb-4">1</div>
                <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">
                  Рассмотрение заявки
                </h3>
                <p className="ode-text-gray">
                  Наша команда изучает вашу концепцию и оценивает совместимость с нашим пространством
                </p>
              </div>

              <div className="ode-text-center">
                <div className="ode-text-6xl ode-text-primary ode-mb-4">2</div>
                <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">
                  Связь с вами
                </h3>
                <p className="ode-text-gray">
                  Мы связываемся с вами для обсуждения деталей и ответов на вопросы
                </p>
              </div>

              <div className="ode-text-center">
                <div className="ode-text-6xl ode-text-primary ode-mb-4">3</div>
                <h3 className="ode-text-xl ode-font-semibold ode-text-charcoal ode-mb-2">
                  Заключение договора
                </h3>
                <p className="ode-text-gray">
                  При положительном решении мы подписываем договор и начинаем сотрудничество
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ApplyForTenancyPage
