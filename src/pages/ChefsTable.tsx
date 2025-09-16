
import { useState } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { useSEO } from '@/hooks/useSEO';
import { BreadcrumbSchema, BreadcrumbNavigation } from '@/components/seo/BreadcrumbSchema';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, Users, Wine, Sparkles, Calendar, Star } from 'lucide-react';
import TimeslotBooking from '@/components/TimeslotBooking';
import ChefsTableGallery from '@/components/ChefsTableGallery';


const ChefsTable = () => {
  const [showBooking, setShowBooking] = useState(false);
  const { getPageData } = useSEO();
  const pageData = getPageData('/chefs-table');

  const menuPreview = [
    "Амузы-буш от шефа",
    "Тартар из тунца с авокадо", 
    "Баранина с травами и овощами",
    "Десерт-сюрприз",
    "Комплимент от шефа"
  ];

  const tasteQuestLevels = [
    { level: 1, visits: "1-3", reward: "Приветственный коктейль" },
    { level: 2, visits: "4-6", reward: "Дегустация вин" },
    { level: 3, visits: "7-10", reward: "Персональное блюдо от шефа" },
    { level: 4, visits: "11+", reward: "VIP статус и приоритет" }
  ];

  if (showBooking) {
    return (
      <div className="min-h-screen bg-background">
        <ImprovedNavigation />
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setShowBooking(false)}
            variant="ghost" 
            className="mb-6"
          >
            ← Назад к Chef's Table
          </Button>
          <TimeslotBooking 
            experienceType="chefs-table"
            experienceTitle="Chef's Table"
            maxGuests={30}
            onBookingComplete={() => setShowBooking(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        image={pageData.image}
        type={pageData.type}
        experienceType="Chef's Table"
        price="55"
        availability="Вечера Вт-Сб"
      />
      
      <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      <div className="container mx-auto px-4">
        <BreadcrumbNavigation />
      </div>
        
        {/* Hero Section */}
        <section className="relative h-[70vh] bg-gradient-to-r from-burgundy-primary/90 to-earth-warm/90 flex items-center justify-center text-white">
          <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ChefHat className="h-12 w-12" />
              <h1 className="text-5xl font-bold">Chef's Table</h1>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Эксклюзивный гастрономический опыт в самом сердце ODE Food Hall
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge variant="secondary" className="text-lg py-2 px-4">
                <Users className="h-4 w-4 mr-2" />
                30 гостей
              </Badge>
              <Badge variant="secondary" className="text-lg py-2 px-4">
                <Clock className="h-4 w-4 mr-2" />
                5 курсов
              </Badge>
              <Badge variant="secondary" className="text-lg py-2 px-4">
                <Wine className="h-4 w-4 mr-2" />
                Винное сопровождение
              </Badge>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Main Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Что такое Chef's Table?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chef's Table @ ODE Food Hall - это уникальный гастрономический опыт, где 30 гостей собираются за одним большим столом для дегустации авторского 5-курсового меню.
                </p>
                <p className="text-muted-foreground">
                  Каждый вечер - это новая история, рассказанная через вкусы и ароматы. Наш шеф-повар лично представляет каждое блюдо, делясь секретами приготовления и философией кухни.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Стоимость:</h4>
                  <div className="space-y-1 text-sm">
                    <div>• Основное меню: <span className="font-semibold">55 USD</span></div>
                    <div>• Винное сопровождение: <span className="font-semibold">+15 USD</span></div>
                    <div>• Комбуча-пара: <span className="font-semibold">+8 USD</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Расписание
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Частота:</span>
                    <span className="text-muted-foreground">5 вечеров в неделю</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Время:</span>
                    <span className="text-muted-foreground">19:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Продолжительность:</span>
                    <span className="text-muted-foreground">3 часа</span>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>Внимание:</strong> Места исчезают быстро! Бронирование обычно доступно за 2-3 дня вперед.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photo Gallery */}
          <ChefsTableGallery />

          {/* Menu Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Примерное меню</CardTitle>
              <p className="text-muted-foreground">
                Меню меняется каждый вечер в зависимости от сезонных продуктов
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuPreview.map((dish, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{index + 1}</span>
                    </div>
                    <span className="font-medium">{dish}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Taste Quest Program */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Программа Taste Quest
              </CardTitle>
              <p className="text-muted-foreground">
                Эксклюзивная программа лояльности для постоянных гостей Chef's Table
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {tasteQuestLevels.map((level, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {level.level}
                      </div>
                      <div>
                        <h4 className="font-semibold">Уровень {level.level}</h4>
                        <p className="text-sm text-muted-foreground">{level.visits} посещений</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-primary">{level.reward}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


          {/* Booking CTA */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Готовы к гастрономическому путешествию?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Присоединяйтесь к нам за Chef's Table и откройте новые грани вкуса в компании единомышленников
              </p>
              <Button 
                size="lg" 
                onClick={() => setShowBooking(true)}
                className="bg-burgundy-primary hover:bg-burgundy-primary/90 text-white"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Забронировать место
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ChefsTable;
