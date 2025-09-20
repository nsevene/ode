import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

const FermentSector = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      name: 'Kombucha Tasting Flight',
      description:
        '4 вида домашней комбучи: имбирь-лимон, мята-лайм, гранат, классическая',
      price: 18,
      image: '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png',
      category: 'Напитки',
      spicy: false,
      vegetarian: true,
      popular: true,
    },
    {
      id: 2,
      name: 'Kimchi Bowl',
      description:
        'Традиционное корейское кимчи с рисом, маринованными овощами и ферментированным соусом',
      price: 22,
      image: '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
      category: 'Основные блюда',
      spicy: true,
      vegetarian: true,
      popular: false,
    },
    {
      id: 3,
      name: 'Tempeh Satay',
      description:
        'Маринованный темпе на шпажках с арахисовым соусом и ферментированными огурцами',
      price: 16,
      image: '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png',
      category: 'Закуски',
      spicy: false,
      vegetarian: true,
      popular: true,
    },
    {
      id: 4,
      name: 'Fermented Vegetable Platter',
      description:
        'Ассорти из ферментированных овощей: свекла, морковь, капуста, дайкон',
      price: 14,
      image: '/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png',
      category: 'Закуски',
      spicy: false,
      vegetarian: true,
      popular: false,
    },
    {
      id: 5,
      name: 'Miso Ramen',
      description:
        'Традиционный рамен с мисо-бульоном, ферментированными овощами и яйцом',
      price: 26,
      image: '/lovable-uploads/f41aad56-be6e-42c6-b101-46d8f2520a51.png',
      category: 'Основные блюда',
      spicy: false,
      vegetarian: false,
      popular: true,
    },
  ];

  const seoData = {
    title:
      '🧪 FERMENT Sector - Живые культуры и ферментированные вкусы | ODE Food Hall',
    description:
      'Попробуйте уникальные ферментированные блюда и напитки в секторе FERMENT. Комбуча, кимчи, темпе и другие живые культуры для вашего здоровья.',
    keywords:
      'ферментированная еда, комбуча, кимчи, темпе, пробиотики, здоровое питание, Убуд, живые культуры',
    image: '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png',
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seoData} />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-amber-400 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-primary/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к Taste Compass
            </Button>

            <Badge className="mb-4 bg-white/90 text-foreground text-lg px-4 py-2">
              🧪 FERMENT
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Origine Taste. Origine Feels.
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mb-6">
              Живые культуры и ферментированные вкусы, которые восстанавливают
              связь с истоками
            </p>

            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>10:00 - 22:00</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Сектор 1, Taste Compass</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                <span>Высокий рейтинг</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* About Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              О секторе FERMENT
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  В секторе FERMENT мы празднуем древнее искусство ферментации —
                  процесс, который не только сохраняет продукты, но и создает
                  уникальные вкусы и полезные пробиотики.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Наша философия "Origine Taste. Origine Feels" отражает
                  стремление вернуться к истокам кулинарии, когда еда была не
                  просто питанием, а лекарством и источником жизненной энергии.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <h3 className="font-bold text-2xl text-amber-600">20+</h3>
                    <p className="text-sm text-muted-foreground">
                      Видов ферментов
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-bold text-2xl text-orange-600">100%</h3>
                    <p className="text-sm text-muted-foreground">
                      Живые культуры
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png"
                  alt="Fermented foods"
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">Меню</h2>
              <div className="flex gap-2">
                <Badge variant="outline">Живые культуры</Badge>
                <Badge variant="outline">Пробиотики</Badge>
                <Badge variant="outline">Здоровое питание</Badge>
              </div>
            </div>

            <div className="grid gap-6">
              {menuItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 md:h-auto">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground">
                            {item.name}
                          </h3>
                          {item.popular && (
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-800"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              Популярное
                            </Badge>
                          )}
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                          ${item.price}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.vegetarian && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Вегетарианское
                            </Badge>
                          )}
                          {item.spicy && (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200"
                            >
                              🌶️ Острое
                            </Badge>
                          )}
                        </div>

                        <Button className="bg-amber-600 hover:bg-amber-700">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Заказать
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🦠 Живые культуры
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Все наши ферментированные продукты содержат живые
                  пробиотические культуры, полезные для пищеварения и
                  иммунитета.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🥬 Собственное производство
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Мы самостоятельно ферментируем овощи и готовим комбучу в
                  специально оборудованной лаборатории ферментации.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🌱 Экологично
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Используем только органические ингредиенты местного
                  производства и экологичную упаковку.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FermentSector;
