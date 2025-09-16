import React from 'react';
import { Link } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Coffee, 
  ChefHat, 
  Utensils, 
  Wine, 
  TreePine, 
  Laptop, 
  Sunset, 
  Building2,
  Cigarette,
  Calendar,
  Users,
  GraduationCap,
  Music
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Spaces = () => {
  const isMobile = useIsMobile();

  const firstFloorSpaces = [
    {
      name: "Bakery & Desserts (AC)",
      area: "100 м²", 
      description: "Вся выпечка + классические десерты",
      features: ["Кондиционер", "40 посадок", "Кейк-кубы", "Чизкейки", "Тирамису"],
      icon: Coffee,
      color: "text-orange-600"
    },
    {
      name: "Kitchen Corners",
      area: "12 точек",
      description: "Все кулинарные направления",
      features: ["8 вкусовых секторов", "12 kitchen-corners", "Pop-up кухня", "Live cooking"],
      icon: ChefHat,
      color: "text-orange-600"
    },
    {
      name: "Beverage Bar",
      area: "—",
      description: "Полный спектр напитков",
      features: ["Wine by glass", "Craft beer", "Cocktails", "Coffee & tea"],
      icon: Wine,
      color: "text-purple-600"
    },
    {
      name: "Gelato Bar",
      area: "—",
      description: "Джелато-остров у Beverage Bar",
      features: ["16 сортов джелато", "Take-away", "Ремесленное джелато", "Сезонные вкусы"],
      icon: Coffee,
      color: "text-purple-600"
    }
  ];

  const secondFloorSpaces = [
    {
      name: "Taste Garden",
      area: "150 м²",
      description: "Мастер-классы, лекции, ужины",
      schedule: "17:00–19:30",
      features: ["Live выступления", "Master-классы", "Лекции", "Private dinners"],
      icon: GraduationCap,
      color: "text-emerald-600"
    },
    {
      name: "OdeGarden",
      area: "100 м²",
      description: "Арендуемое event-пространство",
      schedule: "В свободные часы",
      features: ["Private events", "Корпоративы", "Celebrations", "Workshops"],
      icon: TreePine,
      color: "text-green-700"
    },
    {
      name: "Coworking",
      area: "8 м²",
      description: "AC-зона для работы",
      schedule: "Йога: 08:00",
      features: ["Тихая работа", "WiFi", "AC comfort", "Утренняя йога"],
      icon: Laptop,
      color: "text-blue-500"
    },
    {
      name: "Sunset Terrace",
      area: "100 м²",
      description: "Открытая терраса с видом",
      schedule: "Закат",
      features: ["Sunset views", "Открытая терраса", "Photo spot", "Evening drinks"],
      icon: Sunset,
      color: "text-yellow-600"
    },
    {
      name: "Staircase Zone",
      area: "20 м²",
      description: "Арт-инсталляция Wine Staircase",
      schedule: "—",
      features: ["Wine display", "Арт-инсталляция", "Photo spot", "Wine education"],
      icon: Building2,
      color: "text-red-700"
    },
    {
      name: "Lounge & Hookah",
      area: "90 м²",
      description: "Кальян-бар + zero-proof коктейли",
      schedule: "Вечер",
      features: ["Hookah lounge", "Zero-proof cocktails", "Relax zone", "Social space"],
      icon: Cigarette,
      color: "text-gray-600"
    },
    {
      name: "Wine & Bottle Bar",
      area: "20 м²",
      description: "Магазин + дегустации",
      schedule: "Дегустации",
      features: ["Wine retail", "Bottle service", "Wine tastings", "Sommelier"],
      icon: Wine,
      color: "text-red-600"
    },
    {
      name: "Sunday Market",
      area: "—",
      description: "Фермерский маркет",
      schedule: "Вс 07:00–09:00",
      features: ["Local farmers", "Organic products", "Traditional crafts", "Community"],
      icon: Users,
      color: "text-green-500"
    }
  ];

  const events = [
    { name: "Yoga", time: "08:00 ежедневно", location: "Coworking" },
    { name: "Sunday Market", time: "07:00–09:00 вс", location: "2-й этаж" },
    { name: "Chef's Table", time: "17:00–19:30", location: "Taste Garden" },
    { name: "Live Music", time: "19:30–22:00", location: "Taste Garden" },
    { name: "Master-классы", time: "По расписанию", location: "Taste Garden / OdeGarden" },
    { name: "Wine Tastings", time: "По расписанию", location: "Wine & Bottle Bar" }
  ];

  return (
    <div className="min-h-screen bg-gradient-light">
      <ImprovedNavigation />
      
      <main className={`${isMobile ? 'pb-20' : ''}`}>
        {/* Hero Section */}
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Наши пространства
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Два этажа возможностей — от кулинарного путешествия до релакса и событий
              </p>
            </div>
          </div>
        </section>

        {/* Floors Tabs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="first-floor" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="first-floor">1-й этаж</TabsTrigger>
                <TabsTrigger value="second-floor">2-й этаж</TabsTrigger>
              </TabsList>

              {/* First Floor */}
              <TabsContent value="first-floor" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Первый этаж</h2>
                  <p className="text-muted-foreground">
                    Кулинарное сердце ODE — все kitchen-corners, beverage bar и комфортные зоны
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {firstFloorSpaces.map((space, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <space.icon className={`w-8 h-8 ${space.color}`} />
                          <Badge variant="outline">{space.area}</Badge>
                        </div>
                        <CardTitle className="text-xl">{space.name}</CardTitle>
                        <CardDescription>{space.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {space.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Second Floor */}
              <TabsContent value="second-floor" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Второй этаж</h2>
                  <p className="text-muted-foreground">
                    Пространство событий, релакса и особых переживаний с видом на закат
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {secondFloorSpaces.map((space, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <space.icon className={`w-8 h-8 ${space.color}`} />
                            <Badge variant="outline">{space.area}</Badge>
                          </div>
                          {space.schedule && (
                            <Badge variant="secondary" className="text-xs">
                              {space.schedule}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{space.name}</CardTitle>
                        <CardDescription>{space.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {space.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Events Schedule */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Расписание событий</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-1">{event.time}</p>
                    <Badge variant="outline" className="text-xs">{event.location}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Rental CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Аренда пространств</CardTitle>
                <CardDescription>
                  OdeGarden доступен для частных мероприятий в свободные часы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link to="/vendors">Rent Space</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/events">View Events</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Spaces;