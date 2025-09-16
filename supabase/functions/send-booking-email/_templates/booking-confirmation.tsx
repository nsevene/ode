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
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface BookingConfirmationProps {
  guestName: string
  experienceType: string
  bookingDate: string
  timeSlot: string
  guestCount: number
  totalAmount: number
  bookingId: string
  qrCodeUrl?: string
}

export const BookingConfirmationEmail = ({
  guestName,
  experienceType,
  bookingDate,
  timeSlot,
  guestCount,
  totalAmount,
  bookingId,
  qrCodeUrl,
}: BookingConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Ваше бронирование в ODE Food Hall подтверждено!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={h1}>ODE Food Hall</Heading>
              <Text style={subtitle}>Gastro Village Ubud, Bali</Text>
            </Column>
          </Row>
        </Section>

        <Section style={content}>
          <Heading style={h2}>Бронирование подтверждено! ✅</Heading>
          <Text style={paragraph}>
            Здравствуйте, {guestName}! Мы рады подтвердить ваше бронирование в ODE Food Hall.
          </Text>

          <Section style={detailsBox}>
            <Heading style={h3}>Детали бронирования</Heading>
            <Hr style={divider} />
            
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>Мероприятие:</Text>
              </Column>
              <Column>
                <Text style={value}>{getExperienceTitle(experienceType)}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>Дата:</Text>
              </Column>
              <Column>
                <Text style={value}>{formatDate(bookingDate)}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>Время:</Text>
              </Column>
              <Column>
                <Text style={value}>{timeSlot}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>Гостей:</Text>
              </Column>
              <Column>
                <Text style={value}>{guestCount} человек</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>Сумма:</Text>
              </Column>
              <Column>
                <Text style={highlightValue}>${totalAmount}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>ID бронирования:</Text>
              </Column>
              <Column>
                <Text style={codeValue}>{bookingId}</Text>
              </Column>
            </Row>
          </Section>

          {qrCodeUrl && (
            <Section style={qrSection}>
              <Heading style={h3}>Ваш QR-код</Heading>
              <Text style={paragraph}>
                Покажите этот QR-код при посещении для быстрой регистрации:
              </Text>
              <Img src={qrCodeUrl} alt="QR Code" style={qrCode} />
            </Section>
          )}

          <Section style={infoSection}>
            <Heading style={h3}>Важная информация</Heading>
            <Text style={paragraph}>
              • Пожалуйста, прибудьте за 10 минут до начала<br/>
              • При опоздании более чем на 15 минут столик может быть передан другим гостям<br/>
              • Для изменения бронирования свяжитесь с нами не менее чем за 2 часа<br/>
              • Отмена бронирования возможна не менее чем за 24 часа
            </Text>
          </Section>

          <Section style={locationSection}>
            <Heading style={h3}>Как нас найти</Heading>
            <Text style={paragraph}>
              <strong>ODE Food Hall</strong><br/>
              Jl. Raya Ubud, Ubud, Bali<br/>
              Телефон: +62 361 XXX XXXX<br/>
              WhatsApp: +62 812 XXXX XXXX
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button href="https://ode-food-hall.lovable.app/my-bookings" style={button}>
              Просмотреть мои бронирования
            </Button>
          </Section>
        </Section>

        <Hr style={finalDivider} />
        
        <Section style={footer}>
          <Text style={footerText}>
            Спасибо, что выбрали ODE Food Hall!<br/>
            Мы ждем вас в нашем тропическом гастро-оазисе.
          </Text>
          <Text style={footerSmall}>
            Если у вас есть вопросы, не стесняйтесь обращаться к нам.<br/>
            © 2024 ODE Food Hall. Все права защищены.
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

// Styles
const main = {
  backgroundColor: '#fafafa',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#2d5a2d',
  borderRadius: '12px 12px 0 0',
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  lineHeight: '1.2',
}

const subtitle = {
  color: '#e5e5e5',
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
  color: '#2d5a2d',
  fontSize: '24px',
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

const detailsBox = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const detailRow = {
  margin: '12px 0',
}

const labelColumn = {
  width: '40%',
  paddingRight: '16px',
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
  color: '#2d5a2d',
  fontSize: '18px',
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

const divider = {
  borderColor: '#e9ecef',
  margin: '16px 0',
}

const qrSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '24px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
}

const qrCode = {
  width: '200px',
  height: '200px',
  margin: '16px auto',
}

const infoSection = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const locationSection = {
  backgroundColor: '#d1ecf1',
  border: '1px solid #bee5eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#2d5a2d',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 32px',
  borderRadius: '8px',
  display: 'inline-block',
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
  margin: '0 0 16px 0',
}

const footerSmall = {
  color: '#999999',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
}

export default BookingConfirmationEmail