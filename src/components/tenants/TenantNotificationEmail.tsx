import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from '@react-email/components';

interface TenantNotificationEmailProps {
  company_name: string;
  contact_person: string;
  status: 'approved' | 'rejected' | 'pending';
  admin_comment?: string;
  booking_id: string;
}

export const TenantNotificationEmail = ({
  company_name,
  contact_person,
  status,
  admin_comment,
  booking_id,
}: TenantNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {status === 'approved' 
        ? `Ваша заявка на аренду одобрена!`
        : status === 'rejected'
        ? `Обновление по вашей заявке на аренду`
        : `Ваша заявка получена и рассматривается`
      }
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          ODE Food Hall - {status === 'approved' ? 'Заявка одобрена!' : 'Обновление заявки'}
        </Heading>
        
        <Text style={text}>
          Здравствуйте, {contact_person}!
        </Text>

        <Text style={text}>
          {status === 'approved' && (
            <>
              Отличные новости! Ваша заявка от компании <strong>{company_name}</strong> на аренду 
              помещения в ODE Food Hall была <strong>одобрена</strong>.
            </>
          )}
          {status === 'rejected' && (
            <>
              К сожалению, мы не можем одобрить заявку от компании <strong>{company_name}</strong> 
              на аренду помещения в ODE Food Hall в данный момент.
            </>
          )}
          {status === 'pending' && (
            <>
              Спасибо за вашу заявку от компании <strong>{company_name}</strong> на аренду 
              помещения в ODE Food Hall. Ваша заявка получена и находится на рассмотрении.
            </>
          )}
        </Text>

        {admin_comment && (
          <Section style={commentSection}>
            <Text style={commentTitle}>Комментарий от нашей команды:</Text>
            <Text style={commentText}>{admin_comment}</Text>
          </Section>
        )}

        <Section style={buttonSection}>
          {status === 'approved' && (
            <>
              <Text style={text}>
                Наша команда свяжется с вами в ближайшие дни для обсуждения деталей договора 
                аренды и следующих шагов.
              </Text>
              <Button
                href={`https://odefoodhall.com/tenants?ref=${booking_id}`}
                style={button}
              >
                Перейти в портал арендатора
              </Button>
            </>
          )}
          {status === 'rejected' && (
            <Text style={text}>
              Мы ценим ваш интерес к ODE Food Hall. Если у вас есть вопросы или вы хотели бы 
              обсудить возможности сотрудничества в будущем, не стесняйтесь обращаться к нам.
            </Text>
          )}
          {status === 'pending' && (
            <Text style={text}>
              Мы рассмотрим вашу заявку и свяжемся с вами в течение 2-3 рабочих дней. 
              Если у вас есть дополнительные вопросы, вы можете связаться с нами.
            </Text>
          )}
        </Section>

        <Text style={footer}>
          <strong>Контакты для связи:</strong><br />
          Email: tenants@odefoodhall.com<br />
          Телефон: +62 361 123 4567<br />
          Адрес: Jl. Example Street, Canggu, Bali
        </Text>

        <Text style={footer}>
          С уважением,<br />
          Команда ODE Food Hall
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const commentSection = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const commentTitle = {
  color: '#495057',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const commentText = {
  color: '#495057',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  fontStyle: 'italic',
};

const buttonSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#8B0000',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '16px 0',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 16px 0',
};

export default TenantNotificationEmail;