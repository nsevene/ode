# 🎯 Промпт 1: Core Integration - Связывание страниц и навигация

## 📋 Задача
Связать все существующие компоненты и страницы в единое приложение с полноценной навигацией и пользовательскими сценариями.

## 🎯 Цели
1. **Создать единую навигационную систему** для всего приложения
2. **Реализовать пользовательские сценарии** от регистрации до заказа
3. **Настроить передачу данных** между компонентами
4. **Добавить состояния загрузки** и обработку ошибок

## 📊 Текущее состояние
- ✅ **300+ компонентов** созданы
- ✅ **97 страниц** реализованы
- ✅ **Роутинг** настроен в App.tsx
- ❌ **Навигация** между страницами отсутствует
- ❌ **Пользовательские сценарии** не реализованы
- ❌ **Контекст данных** между компонентами отсутствует

## 🔧 Технические требования

### **1. Навигационная система**
```typescript
// Создать единую навигацию
interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
  roles?: string[];
  isExternal?: boolean;
}

// Основная навигация
const mainNavigation: NavigationItem[] = [
  {
    id: 'home',
    label: 'Главная',
    path: '/',
    icon: HomeIcon
  },
  {
    id: 'menu',
    label: 'Меню',
    path: '/menu',
    icon: MenuIcon
  },
  {
    id: 'events',
    label: 'События',
    path: '/events',
    icon: CalendarIcon
  },
  {
    id: 'booking',
    label: 'Бронирование',
    path: '/booking',
    icon: BookOpenIcon
  },
  {
    id: 'admin',
    label: 'Админ-панель',
    path: '/admin',
    icon: SettingsIcon,
    roles: ['admin']
  }
];
```

### **2. Пользовательские сценарии**

#### **Сценарий 1: Регистрация и вход**
```typescript
// 1. Пользователь заходит на главную
// 2. Нажимает "Войти" или "Регистрация"
// 3. Заполняет форму
// 4. Получает подтверждение
// 5. Перенаправляется в профиль

const AuthFlow = () => {
  const [step, setStep] = useState<'login' | 'register' | 'profile'>('login');
  
  const handleAuthSuccess = (user: User) => {
    setStep('profile');
    // Перенаправить в профиль
  };
  
  return (
    <div>
      {step === 'login' && <LoginForm onSuccess={handleAuthSuccess} />}
      {step === 'register' && <RegisterForm onSuccess={handleAuthSuccess} />}
      {step === 'profile' && <ProfileSetup />}
    </div>
  );
};
```

#### **Сценарий 2: Просмотр меню и заказ**
```typescript
// 1. Пользователь заходит в меню
// 2. Выбирает категорию
// 3. Добавляет блюда в корзину
// 4. Переходит к оформлению заказа
// 5. Заполняет данные доставки
// 6. Выбирает способ оплаты
// 7. Подтверждает заказ

const MenuFlow = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'menu' | 'cart' | 'checkout' | 'payment'>('menu');
  
  const addToCart = (item: MenuItem) => {
    setCart(prev => [...prev, { ...item, quantity: 1 }]);
  };
  
  const proceedToCheckout = () => {
    setStep('checkout');
  };
  
  return (
    <div>
      {step === 'menu' && <MenuPage onAddToCart={addToCart} />}
      {step === 'cart' && <CartPage items={cart} onProceed={proceedToCheckout} />}
      {step === 'checkout' && <CheckoutPage items={cart} />}
      {step === 'payment' && <PaymentPage items={cart} />}
    </div>
  );
};
```

#### **Сценарий 3: Бронирование столика**
```typescript
// 1. Пользователь заходит в раздел бронирования
// 2. Выбирает дату и время
// 3. Выбирает количество гостей
// 4. Заполняет контактные данные
// 5. Подтверждает бронирование
// 6. Получает подтверждение

const BookingFlow = () => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'confirmation'>('date');
  
  const handleDateSelect = (date: Date) => {
    setBookingData(prev => ({ ...prev, date }));
    setStep('time');
  };
  
  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, time }));
    setStep('details');
  };
  
  return (
    <div>
      {step === 'date' && <DateSelector onSelect={handleDateSelect} />}
      {step === 'time' && <TimeSelector onSelect={handleTimeSelect} />}
      {step === 'details' && <BookingDetailsForm data={bookingData} />}
      {step === 'confirmation' && <BookingConfirmation data={bookingData} />}
    </div>
  );
};
```

### **3. Контекстные провайдеры**

#### **AppContext для глобального состояния**
```typescript
interface AppContextType {
  // Пользователь
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
  
  // Корзина
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  
  // Бронирование
  currentBooking: BookingData | null;
  setCurrentBooking: (booking: BookingData | null) => void;
  
  // UI состояние
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Навигация
  currentPage: string;
  setCurrentPage: (page: string) => void;
  navigateTo: (path: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  
  const addToCart = (item: MenuItem) => {
    setCart(prev => [...prev, { ...item, quantity: 1 }]);
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const navigateTo = (path: string) => {
    setCurrentPage(path);
    // Здесь будет логика навигации
  };
  
  const value: AppContextType = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    currentBooking,
    setCurrentBooking,
    isLoading,
    error,
    setLoading,
    setError,
    currentPage,
    setCurrentPage,
    navigateTo
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

### **4. Компоненты навигации**

#### **MainNavigation компонент**
```typescript
const MainNavigation = () => {
  const { user, isAuthenticated, role } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = mainNavigation.filter(item => {
    if (item.roles && !item.roles.includes(role || 'guest')) {
      return false;
    }
    return true;
  });
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-8 w-8" src="/logo.svg" alt="ODE Food Hall" />
            </Link>
          </div>
          
          {/* Десктопная навигация */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Пользовательское меню */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserMenu user={user} />
            ) : (
              <AuthButtons />
            )}
          </div>
          
          {/* Мобильное меню */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
```

#### **Breadcrumbs компонент**
```typescript
const Breadcrumbs = () => {
  const location = useLocation();
  const { currentPage } = useAppContext();
  
  const getBreadcrumbs = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Главная', path: '/' }];
    
    let currentPath = '';
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: getPageLabel(segment),
        path: currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs(location.pathname);
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-500">{breadcrumb.label}</span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-gray-700 hover:text-gray-900"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
```

### **5. Состояния загрузки и ошибок**

#### **LoadingStates компонент**
```typescript
const LoadingStates = () => {
  const { isLoading, error } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="fixed inset-0 bg-red-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Произошла ошибка</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Перезагрузить страницу
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};
```

### **6. Интеграция с существующими компонентами**

#### **Обновление App.tsx**
```typescript
// App.tsx
import { AppProvider } from '@/contexts/AppContext';
import { MainNavigation } from '@/components/navigation/MainNavigation';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { LoadingStates } from '@/components/LoadingStates';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <MainNavigation />
          <Breadcrumbs />
          <LoadingStates />
          
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              {/* Существующие маршруты */}
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/events" element={<Events />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/admin" element={<Admin />} />
              {/* ... остальные маршруты */}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
```

## 📋 Чек-лист выполнения

### **День 1-2: Навигационная система**
- [ ] Создать `NavigationItem` интерфейс
- [ ] Реализовать `MainNavigation` компонент
- [ ] Добавить `Breadcrumbs` компонент
- [ ] Создать `UserMenu` компонент
- [ ] Добавить мобильную навигацию

### **День 3-4: Контекстные провайдеры**
- [ ] Создать `AppContext` и `AppProvider`
- [ ] Реализовать глобальное состояние
- [ ] Добавить методы для работы с корзиной
- [ ] Настроить управление бронированием
- [ ] Добавить UI состояние

### **День 5-7: Пользовательские сценарии**
- [ ] Реализовать сценарий регистрации/входа
- [ ] Создать сценарий просмотра меню и заказа
- [ ] Добавить сценарий бронирования столика
- [ ] Интегрировать с существующими компонентами
- [ ] Добавить состояния загрузки и ошибок

## 🎯 Ожидаемый результат

После выполнения этого промпта у нас будет:

1. **✅ Единая навигационная система** для всего приложения
2. **✅ Полноценные пользовательские сценарии** от регистрации до заказа
3. **✅ Глобальное управление состоянием** через контекст
4. **✅ Состояния загрузки и обработка ошибок** на всех страницах
5. **✅ Мобильная навигация** и адаптивный дизайн
6. **✅ Breadcrumbs** для лучшей навигации
7. **✅ Интеграция** всех существующих компонентов

## 🚀 Следующие шаги

После завершения этого этапа можно переходить к:
- **Промпт 2:** Backend Logic And Security
- **Промпт 3:** State Management
- **Промпт 4:** Admin CMS Features

**Готов начать реализацию!** 🎯
