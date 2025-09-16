# Развертывание ODE Food Hall на ISPmanager

## 1. Подготовка проекта

### Сборка проекта
```bash
# Установка зависимостей
npm install

# Сборка для продакшена
npm run build

# Проверка сборки
npm run preview
```

### Создание .env файла
```env
# Supabase
VITE_SUPABASE_URL=https://ejwjrsgkxxrwlyfohdat.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email
VITE_RESEND_API_KEY=re_...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Environment
NODE_ENV=production
```

## 2. Настройка ISPmanager

### Создание домена
1. Войдите в панель ISPmanager
2. Перейдите в "WWW-домены" → "Добавить домен"
3. Введите домен: `odefoodhall.com`
4. Выберите "Статический сайт"
5. Настройте SSL сертификат (Let's Encrypt)

### Настройка веб-сервера
1. Перейдите в "WWW-домены" → ваш домен → "Настройки"
2. Включите "Сжатие gzip"
3. Настройте кэширование:
   - Статические файлы: 1 год
   - HTML файлы: 1 час
   - API запросы: 5 минут

### Настройка Nginx (если доступно)
```nginx
server {
    listen 80;
    server_name odefoodhall.com www.odefoodhall.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name odefoodhall.com www.odefoodhall.com;
    
    root /var/www/odefoodhall.com/public_html;
    index index.html;
    
    # SSL настройки
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Кэширование
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API прокси (если нужно)
    location /api/ {
        proxy_pass https://ejwjrsgkxxrwlyfohdat.supabase.co/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 3. Загрузка файлов

### Через FTP/SFTP
1. Подключитесь к серверу через FTP клиент
2. Загрузите содержимое папки `dist/` в `public_html/`
3. Убедитесь, что права доступа установлены правильно (755 для папок, 644 для файлов)

### Через Git (рекомендуется)
```bash
# На сервере
cd /var/www/odefoodhall.com
git clone https://github.com/your-repo/ode-food-hall.git .
npm install
npm run build
```

## 4. Настройка переменных окружения

### Создание .env файла на сервере
```bash
# На сервере
cd /var/www/odefoodhall.com
nano .env
```

### Содержимое .env файла
```env
VITE_SUPABASE_URL=https://ejwjrsgkxxrwlyfohdat.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RESEND_API_KEY=re_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
NODE_ENV=production
```

## 5. Настройка базы данных

### Supabase настройки
1. Войдите в Supabase Dashboard
2. Перейдите в Settings → API
3. Обновите URL сайта в настройках
4. Настройте CORS для вашего домена
5. Проверьте RLS политики

### Настройка email
1. В Resend Dashboard добавьте ваш домен
2. Настройте DNS записи для аутентификации
3. Обновите API ключи

## 6. Мониторинг и логи

### Настройка логирования
```bash
# Создание лог файлов
mkdir -p /var/log/odefoodhall
touch /var/log/odefoodhall/access.log
touch /var/log/odefoodhall/error.log
```

### Мониторинг производительности
1. Настройте Google Analytics
2. Подключите Google Search Console
3. Настройте мониторинг Uptime

## 7. Безопасность

### Настройка безопасности
1. Включите HTTPS редирект
2. Настройте HSTS заголовки
3. Ограничьте доступ к админ панели
4. Настройте файрвол

### Резервное копирование
```bash
# Создание скрипта бэкапа
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/odefoodhall_$DATE.tar.gz /var/www/odefoodhall.com
```

## 8. Оптимизация

### CDN настройка
1. Подключите Cloudflare или другой CDN
2. Настройте кэширование статических файлов
3. Включите сжатие

### Оптимизация изображений
1. Используйте WebP формат
2. Настройте lazy loading
3. Оптимизируйте размеры изображений

## 9. Тестирование

### Проверка функциональности
1. Тестирование всех форм
2. Проверка email уведомлений
3. Тестирование платежей
4. Проверка мобильной версии

### Performance тестирование
1. Google PageSpeed Insights
2. GTmetrix
3. WebPageTest

## 10. Поддержка

### Мониторинг ошибок
1. Настройте Sentry или аналогичный сервис
2. Мониторинг логов
3. Уведомления об ошибках

### Обновления
1. Настройте автоматические обновления
2. Тестирование на staging окружении
3. План отката изменений
