import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface BookingReminderProps {
  guestName: string
  experienceType: string
  bookingDate: string
  timeSlot: string
  guestCount: number
  bookingId: string
  hoursUntil: number
}

export const BookingReminderEmail = ({
  guestName,
  experienceType,
  bookingDate,
  timeSlot,
  guestCount,
  bookingId,
  hoursUntil,
}: BookingReminderProps) => (
  <Html>
    <Head />
    <Preview>Напоминание о вашем бронировании в ODE Food Hall через {hoursUntil} ч.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={h1}>⏰ Напоминание</Heading>
              <Text style={subtitle}>ODE Food Hall • Gastro Village Ubud</Text>
            </Column>
          </Row>
        </Section>

        <Section style={content}>
          <Heading style={h2}>
            Ваше бронирование через {hoursUntil} {getHoursWord(hoursUntil)}! 
          </Heading>
          
          <Text style={paragraph}>
            Здравствуйте, {guestName}! 
          </Text>
          
          <Text style={paragraph}>
            Напоминаем о вашем предстоящем визите в ODE Food Hall. 
            Мы готовимся встретить вас в нашем тропическом гастро-оазисе!
          </Text>

          <Section style={reminderBox}>
            <Row style={reminderHeader}>
              <Column>
                <Text style={reminderTitle}>📅 Детали бронирования</Text>
              </Column>
            </Row>
            
            <Row style={detailRow}>
              <Column style={iconColumn}>
                <Text style={emoji}>🍽️</Text>
              </Column>
              <Column style={labelColumn}>
                <Text style={label}>Мероприятие:</Text>
              </Column>
              <Column>
                <Text style={value}>{getExperienceTitle(experienceType)}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconColumn}>
                <Text style={emoji}>📅</Text>
              </Column>
              <Column style={labelColumn}>
                <Text style={label}>Дата:</Text>
              </Column>
              <Column>
                <Text style={highlightValue}>{formatDate(bookingDate)}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconColumn}>
                <Text style={emoji}>⏰</Text>
              </Column>
              <Column style={labelColumn}>
                <Text style={label}>Время:</Text>
              </Column>
              <Column>
                <Text style={highlightValue}>{timeSlot}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconColumn}>
                <Text style={emoji}>👥</Text>
              </Column>
              <Column style={labelColumn}>
                <Text style={label}>Гостей:</Text>
              </Column>
              <Column>
                <Text style={value}>{guestCount} человек</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconColumn}>
                <Text style={emoji}>🎫</Text>
              </Column>
              <Column style={labelColumn}>
                <Text style={label}>ID:</Text>
              </Column>
              <Column>
                <Text style={codeValue}>{bookingId}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={tipsSection}>
            <Heading style={h3}>💡 Полезные советы</Heading>
            <Text style={tipText}>
              🚗 <strong>Парковка:</strong> Бесплатная парковка доступна рядом с рестораном<br/>
              📱 <strong>QR-код:</strong> Сохраните QR-код из письма с подтверждением<br/>
              ⏰ <strong>Время:</strong> Рекомендуем прибыть за 10 минут до начала<br/>
              🌿 <strong>Дресс-код:</strong> Smart casual, удобная обувь для тропического климата
            </Text>
          </Section>

          <Section style={weatherSection}>
            <Heading style={h3}>🌤️ Подготовьтесь к визиту</Heading>
            <Text style={paragraph}>
              В Убуде сейчас тропическая погода. Рекомендуем взять с собой легкую куртку 
              на случай дождя и удобную обувь для перемещения по территории.
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button href="https://ode-food-hall.lovable.app/my-bookings" style={primaryButton}>
              Просмотреть бронирование
            </Button>
            <Button href="https://wa.me/6281234567890" style={secondaryButton}>
              Связаться с нами
            </Button>
          </Section>

          <Section style={contactSection}>
            <Text style={contactTitle}>Нужна помощь?</Text>
            <Text style={contactText}>
              📞 Телефон: +62 361 XXX XXXX<br/>
              💬 WhatsApp: +62 812 XXXX XXXX<br/>
              📧 Email: info@ode-foodhall.com
            </Text>
          </Section>
        </Section>

        <Hr style={finalDivider} />
        
        <Section style={footer}>
          <Text style={footerText}>
            Мы с нетерпением ждем встречи с вами! 🌟<br/>
            Команда ODE Food Hall
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const getExperienceTitle = (type: string) => {
  const titles = {
    'chefs-table': 'Chef\'s Table Experience',
    'wine-tasting': 'Wine Tasting Session', 
    'private-dining': 'Private Dining Experience',
    'cooking-class': 'Cooking Class',
    'regular': 'Обычное посещение'
  }
  return titles[type as keyof typeof titles] || type
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getHoursWord = (hours: number) => {
  if (hours === 1) return 'час'
  if (hours >= 2 && hours <= 4) return 'часа'
  return 'часов'
}

// Styles
const main = {
  backgroundColor: '#f0f8ff',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  background: 'linear-gradient(135deg, #d17a3a, #c49b8a)',
  borderRadius: '12px 12px 0 0',
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
}

const subtitle = {
  color: '#f5f5f5',
  fontSize: '16px',
  margin: '0',
  fontWeight: '400',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
}

const h2 = {
  color: '#d17a3a',
  fontSize: '22px',
  fontWeight: '600',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
}

const h3 = {
  color: '#2d5a2d',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
}

const paragraph = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const reminderBox = {
  background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
  border: '2px solid #d17a3a',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const reminderHeader = {
  marginBottom: '16px',
}

const reminderTitle = {
  color: '#d17a3a',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'center' as const,
}

const detailRow = {
  margin: '12px 0',
}

const iconColumn = {
  width: '10%',
  paddingRight: '8px',
}

const labelColumn = {
  width: '30%',
  paddingRight: '16px',
}

const emoji = {
  fontSize: '16px',
  margin: '0',
}

const label = {
  color: '#666666',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

const value = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: '400',
  margin: '0',
}

const highlightValue = {
  color: '#d17a3a',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
}

const codeValue = {
  color: '#333333',
  fontSize: '14px',
  fontWeight: '400',
  fontFamily: 'monospace',
  backgroundColor: '#f1f3f4',
  padding: '4px 8px',
  borderRadius: '4px',
  margin: '0',
}

const tipsSection = {
  backgroundColor: '#fff8dc',
  border: '1px solid #ffd700',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const tipText = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const weatherSection = {
  backgroundColor: '#e6f3ff',
  border: '1px solid #87ceeb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const primaryButton = {
  backgroundColor: '#2d5a2d',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  margin: '0 8px 16px 8px',
}

const secondaryButton = {
  backgroundColor: '#25d366',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  margin: '0 8px',
}

const contactSection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const contactTitle = {
  color: '#2d5a2d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
}

const contactText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const finalDivider = {
  borderColor: '#e9ecef',
  margin: '32px 0 24px 0',
}

const footer = {
  textAlign: 'center' as const,
}

const footerText = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
}

export default BookingReminderEmail