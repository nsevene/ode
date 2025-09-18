// Email configuration and templates
export const EMAIL_CONFIG = {
  from: 'ODE Food Hall <noreply@odefoodhall.com>',
  replyTo: 'support@odefoodhall.com',
  baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
} as const;

// Email template types
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface OrderConfirmationEmail {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    vendorName: string;
  }>;
  deliveryAddress: string;
  estimatedDelivery: string;
}

export interface BookingConfirmationEmail {
  customerName: string;
  bookingNumber: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventPrice: number;
  eventDescription?: string;
}

export interface PasswordResetEmail {
  customerName: string;
  resetLink: string;
  expiresIn: string;
}

// Email templates
export const createOrderConfirmationEmail = (data: OrderConfirmationEmail): EmailTemplate => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br>
        <small style="color: #6b7280;">${item.vendorName}</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return {
    subject: `Заказ подтвержден - ${data.orderNumber}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Заказ подтвержден</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ODE Food Hall</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Ваш заказ подтвержден!</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937; margin-top: 0;">Здравствуйте, ${data.customerName}!</h2>
          
          <p>Спасибо за ваш заказ в ODE Food Hall! Мы получили ваш заказ и начали его подготовку.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Детали заказа</h3>
            <p><strong>Номер заказа:</strong> ${data.orderNumber}</p>
            <p><strong>Дата заказа:</strong> ${data.orderDate}</p>
            <p><strong>Адрес доставки:</strong> ${data.deliveryAddress}</p>
            <p><strong>Ожидаемое время доставки:</strong> ${data.estimatedDelivery}</p>
          </div>
          
          <h3 style="color: #1f2937;">Товары в заказе</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Товар</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #d1d5db;">Количество</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #d1d5db;">Цена</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f9fafb; font-weight: bold;">
                <td colspan="2" style="padding: 12px; text-align: right; border-top: 2px solid #d1d5db;">Итого:</td>
                <td style="padding: 12px; text-align: right; border-top: 2px solid #d1d5db;">${formatPrice(data.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>Важно:</strong> Мы свяжемся с вами для подтверждения времени доставки.</p>
          </div>
          
          <p>Если у вас есть вопросы по заказу, свяжитесь с нами:</p>
          <ul style="list-style: none; padding: 0;">
            <li>📧 Email: support@odefoodhall.com</li>
            <li>📞 Телефон: +7 (495) 123-45-67</li>
            <li>🌐 Сайт: <a href="${EMAIL_CONFIG.baseUrl}" style="color: #ea580c;">odefoodhall.com</a></li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${EMAIL_CONFIG.baseUrl}/profile/orders" 
               style="background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Посмотреть заказ
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>© 2024 ODE Food Hall. Все права защищены.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Заказ подтвержден - ${data.orderNumber}
      
      Здравствуйте, ${data.customerName}!
      
      Спасибо за ваш заказ в ODE Food Hall! Мы получили ваш заказ и начали его подготовку.
      
      Детали заказа:
      - Номер заказа: ${data.orderNumber}
      - Дата заказа: ${data.orderDate}
      - Адрес доставки: ${data.deliveryAddress}
      - Ожидаемое время доставки: ${data.estimatedDelivery}
      
      Товары в заказе:
      ${data.items.map(item => `- ${item.name} (${item.vendorName}) x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n')}
      
      Итого: ${formatPrice(data.totalAmount)}
      
      Мы свяжемся с вами для подтверждения времени доставки.
      
      Контакты:
      - Email: support@odefoodhall.com
      - Телефон: +7 (495) 123-45-67
      - Сайт: ${EMAIL_CONFIG.baseUrl}
    `
  };
};

export const createBookingConfirmationEmail = (data: BookingConfirmationEmail): EmailTemplate => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return {
    subject: `Бронирование подтверждено - ${data.bookingNumber}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Бронирование подтверждено</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ODE Food Hall</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Ваше бронирование подтверждено!</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937; margin-top: 0;">Здравствуйте, ${data.customerName}!</h2>
          
          <p>Спасибо за бронирование события в ODE Food Hall! Ваше место зарезервировано.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Детали бронирования</h3>
            <p><strong>Номер бронирования:</strong> ${data.bookingNumber}</p>
            <p><strong>Событие:</strong> ${data.eventTitle}</p>
            <p><strong>Дата:</strong> ${data.eventDate}</p>
            <p><strong>Время:</strong> ${data.eventTime}</p>
            <p><strong>Место:</strong> ${data.eventLocation}</p>
            <p><strong>Стоимость:</strong> ${formatPrice(data.eventPrice)}</p>
          </div>
          
          ${data.eventDescription ? `
            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #0c4a6e;">Описание события</h4>
              <p style="margin: 0; color: #0c4a6e;">${data.eventDescription}</p>
            </div>
          ` : ''}
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>Важно:</strong> Пожалуйста, приходите за 10-15 минут до начала события.</p>
          </div>
          
          <p>Если у вас есть вопросы по бронированию, свяжитесь с нами:</p>
          <ul style="list-style: none; padding: 0;">
            <li>📧 Email: support@odefoodhall.com</li>
            <li>📞 Телефон: +7 (495) 123-45-67</li>
            <li>🌐 Сайт: <a href="${EMAIL_CONFIG.baseUrl}" style="color: #ea580c;">odefoodhall.com</a></li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${EMAIL_CONFIG.baseUrl}/profile/bookings" 
               style="background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Посмотреть бронирования
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>© 2024 ODE Food Hall. Все права защищены.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Бронирование подтверждено - ${data.bookingNumber}
      
      Здравствуйте, ${data.customerName}!
      
      Спасибо за бронирование события в ODE Food Hall! Ваше место зарезервировано.
      
      Детали бронирования:
      - Номер бронирования: ${data.bookingNumber}
      - Событие: ${data.eventTitle}
      - Дата: ${data.eventDate}
      - Время: ${data.eventTime}
      - Место: ${data.eventLocation}
      - Стоимость: ${formatPrice(data.eventPrice)}
      
      ${data.eventDescription ? `Описание события: ${data.eventDescription}` : ''}
      
      Пожалуйста, приходите за 10-15 минут до начала события.
      
      Контакты:
      - Email: support@odefoodhall.com
      - Телефон: +7 (495) 123-45-67
      - Сайт: ${EMAIL_CONFIG.baseUrl}
    `
  };
};

export const createPasswordResetEmail = (data: PasswordResetEmail): EmailTemplate => {
  return {
    subject: 'Восстановление пароля - ODE Food Hall',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Восстановление пароля</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ODE Food Hall</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Восстановление пароля</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937; margin-top: 0;">Здравствуйте, ${data.customerName}!</h2>
          
          <p>Вы запросили восстановление пароля для вашего аккаунта в ODE Food Hall.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" 
               style="background: #ea580c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Восстановить пароль
            </a>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>Важно:</strong> Ссылка действительна в течение ${data.expiresIn}.</p>
        </div>
          
          <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
          
          <p>Если у вас есть вопросы, свяжитесь с нами:</p>
          <ul style="list-style: none; padding: 0;">
            <li>📧 Email: support@odefoodhall.com</li>
            <li>📞 Телефон: +7 (495) 123-45-67</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>© 2024 ODE Food Hall. Все права защищены.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Восстановление пароля - ODE Food Hall
      
      Здравствуйте, ${data.customerName}!
      
      Вы запросили восстановление пароля для вашего аккаунта в ODE Food Hall.
      
      Перейдите по ссылке для восстановления пароля:
      ${data.resetLink}
      
      Ссылка действительна в течение ${data.expiresIn}.
      
      Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
      
      Контакты:
      - Email: support@odefoodhall.com
      - Телефон: +7 (495) 123-45-67
    `
  };
};

// Email sending functions
export const sendEmail = async (to: string, template: EmailTemplate): Promise<boolean> => {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        from: EMAIL_CONFIG.from,
        replyTo: EMAIL_CONFIG.replyTo,
    subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendOrderConfirmation = async (email: string, orderData: OrderConfirmationEmail): Promise<boolean> => {
  const template = createOrderConfirmationEmail(orderData);
  return await sendEmail(email, template);
};

export const sendBookingConfirmation = async (email: string, bookingData: BookingConfirmationEmail): Promise<boolean> => {
  const template = createBookingConfirmationEmail(bookingData);
  return await sendEmail(email, template);
};

export const sendPasswordReset = async (email: string, resetData: PasswordResetEmail): Promise<boolean> => {
  const template = createPasswordResetEmail(resetData);
  return await sendEmail(email, template);
};

// Tenant application email templates
export interface TenantApplicationConfirmationEmail {
  applicantName: string;
  applicationNumber: string;
  businessName: string;
  contactEmail: string;
  phone: string;
  applicationDate: string;
}

export const createTenantApplicationConfirmationEmail = (data: TenantApplicationConfirmationEmail): EmailTemplate => {
  return {
    subject: `Заявка на аренду принята - ${data.applicationNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Заявка на аренду принята</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ODE Food Hall</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Заявка на аренду принята!</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937; margin-top: 0;">Здравствуйте, ${data.applicantName}!</h2>
          
          <p>Спасибо за интерес к аренде пространства в ODE Food Hall! Мы получили вашу заявку и начали ее рассмотрение.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Детали заявки</h3>
            <p><strong>Номер заявки:</strong> ${data.applicationNumber}</p>
            <p><strong>Название бизнеса:</strong> ${data.businessName}</p>
            <p><strong>Контактный email:</strong> ${data.contactEmail}</p>
            <p><strong>Телефон:</strong> ${data.phone}</p>
            <p><strong>Дата подачи:</strong> ${data.applicationDate}</p>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>Что дальше?</strong> Мы рассмотрим вашу заявку в течение 3-5 рабочих дней и свяжемся с вами для обсуждения деталей.</p>
          </div>
          
          <p>Если у вас есть вопросы, свяжитесь с нами:</p>
          <ul style="list-style: none; padding: 0;">
            <li>📧 Email: tenants@odefoodhall.com</li>
            <li>📞 Телефон: +7 (495) 123-45-67</li>
            <li>🌐 Сайт: <a href="${EMAIL_CONFIG.baseUrl}" style="color: #ea580c;">odefoodhall.com</a></li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>© 2024 ODE Food Hall. Все права защищены.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Заявка на аренду принята - ${data.applicationNumber}
      
      Здравствуйте, ${data.applicantName}!
      
      Спасибо за интерес к аренде пространства в ODE Food Hall! Мы получили вашу заявку и начали ее рассмотрение.
      
      Детали заявки:
      - Номер заявки: ${data.applicationNumber}
      - Название бизнеса: ${data.businessName}
      - Контактный email: ${data.contactEmail}
      - Телефон: ${data.phone}
      - Дата подачи: ${data.applicationDate}
      
      Что дальше? Мы рассмотрим вашу заявку в течение 3-5 рабочих дней и свяжемся с вами для обсуждения деталей.
      
      Контакты:
      - Email: tenants@odefoodhall.com
      - Телефон: +7 (495) 123-45-67
      - Сайт: ${EMAIL_CONFIG.baseUrl}
    `
  };
};

export const sendTenantApplicationConfirmation = async (email: string, applicationData: TenantApplicationConfirmationEmail): Promise<boolean> => {
  const template = createTenantApplicationConfirmationEmail(applicationData);
  return await sendEmail(email, template);
};

export const sendTenantApplicationNotification = async (email: string, applicationData: TenantApplicationConfirmationEmail): Promise<boolean> => {
  // Send notification to admin about new tenant application
  const template = {
    subject: `Новая заявка на аренду - ${applicationData.applicationNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Новая заявка на аренду</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #0c4a6e; margin-top: 0;">Новая заявка на аренду</h2>
          <p>Поступила новая заявка на аренду пространства в ODE Food Hall.</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Детали заявки</h3>
          <p><strong>Номер заявки:</strong> ${applicationData.applicationNumber}</p>
          <p><strong>Заявитель:</strong> ${applicationData.applicantName}</p>
          <p><strong>Название бизнеса:</strong> ${applicationData.businessName}</p>
          <p><strong>Контактный email:</strong> ${applicationData.contactEmail}</p>
          <p><strong>Телефон:</strong> ${applicationData.phone}</p>
          <p><strong>Дата подачи:</strong> ${applicationData.applicationDate}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${EMAIL_CONFIG.baseUrl}/admin/tenants" 
             style="background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Просмотреть заявку
          </a>
        </div>
      </body>
      </html>
    `,
    text: `
      Новая заявка на аренду - ${applicationData.applicationNumber}
      
      Поступила новая заявка на аренду пространства в ODE Food Hall.
      
      Детали заявки:
      - Номер заявки: ${applicationData.applicationNumber}
      - Заявитель: ${applicationData.applicantName}
      - Название бизнеса: ${applicationData.businessName}
      - Контактный email: ${applicationData.contactEmail}
      - Телефон: ${applicationData.phone}
      - Дата подачи: ${applicationData.applicationDate}
      
      Просмотреть заявку: ${EMAIL_CONFIG.baseUrl}/admin/tenants
    `
  };
  
  return await sendEmail(email, template);
};