# Настройка поддомена vendors.odefoodhall.com

## Для production развертывания:

### 1. DNS настройки у регистратора домена:
```
Type: CNAME
Name: vendors
Value: ace5a7fd-30d9-4826-beef-eeaf082338ad.lovableproject.com
TTL: 3600
```

### 2. Альтернативно - A запись:
```
Type: A
Name: vendors
Value: 185.158.133.1
TTL: 3600
```

### 3. В Lovable проекте:
- Перейти в Settings → Domains
- Добавить vendors.odefoodhall.com как дополнительный домен
- Следовать инструкциям по верификации

### 4. Обновить роутинг (опционально):
Если нужно, чтобы vendors.odefoodhall.com показывал только страницу vendors, можно добавить условную логику в App.tsx для проверки hostname.

## Текущее решение:
Страница vendors доступна по адресу: `/vendors`