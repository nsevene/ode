import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, Star, Heart, ShoppingCart, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";

const SmokeSector = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      name: "Neapolitan Margherita",
      description: "Классическая пицца Маргарита, приготовленная в дровяной печи при 450°C",
      price: 24,
      image: "/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png",
      category: "Пицца",
      spicy: false,
      signature: true,
      popular: true
    },
    {
      id: 2,
      name: "Smoked Brisket",
      description: "Говяжья грудинка холодного копчения 12 часов с BBQ соусом и маринованными овощами",
      price: 32,
      image: "/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png",
      category: "BBQ",
      spicy: false,
      signature: true,
      popular: true
    },
    {
      id: 3,
      name: "Fire-Grilled Octopus",
      description: "Осьминог на открытом огне с травами, оливковым маслом и лимоном",
      price: 28,
      image: "/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png",
      category: "Морепродукты",
      spicy: false,
      signature: false,
      popular: true
    },
    {
      id: 4,
      name: "Smoked Salmon Pizza",
      description: "Авторская пицца с копченым лососем, каперсами и сливочным сыром",
      price: 26,
      image: "/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png",
      category: "Пицца",
      spicy: false,
      signature: true,
      popular: false
    },
    {
      id: 5,
      name: "Fire-Roasted Vegetables",
      description: "Микс овощей, обжаренных на открытом огне с ароматными травами",
      price: 18,
      image: "/lovable-uploads/f41aad56-be6e-42c6-b101-46d8f2520a51.png",
      category: "Вегетарианское",
      spicy: false,
      signature: false,
      popular: false
    }
  ];

  const seoData = {
    title: "🔥 SMOKE Sector - Огненная кухня и копчение | ODE Food Hall",
    description: "Откройте древний огонь приготовления в секторе SMOKE. Неаполитанская пицца, BBQ, копченые деликатесы и блюда на открытом огне.",
    keywords: "огненная кухня, копчение, неаполитанская пицца, BBQ, дровяная печь, копченые блюда, Убуд",
    image: "/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seoData} />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-red-500 to-orange-600 overflow-hidden">
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
              🔥 SMOKE
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Back to Origin. Forward to Yourself.
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mb-6">
              Древний огонь приготовления, объединяющий традиции разных континентов
            </p>
            
            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>12:00 - 23:00</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Сектор 2, Taste Compass</span>
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
            <h2 className="text-3xl font-bold text-foreground mb-6">О секторе SMOKE</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  Сектор SMOKE — это храм огненной кулинарии, где древние техники приготовления 
                  на открытом огне встречаются с современными технологиями копчения.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Наша дровяная печь разогревается до 450°C для идеальной неаполитанской пиццы, 
                  а коптильня работает круглосуточно для создания невероятных вкусов.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h3 className="font-bold text-2xl text-red-600">450°C</h3>
                    <p className="text-sm text-muted-foreground">Дровяная печь</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-bold text-2xl text-orange-600">12ч</h3>
                    <p className="text-sm text-muted-foreground">Медленное копчение</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png" 
                  alt="Fire cooking" 
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full">
                  <Flame className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">Меню</h2>
              <div className="flex gap-2">
                <Badge variant="outline">Дровяная печь</Badge>
                <Badge variant="outline">Копчение</Badge>
                <Badge variant="outline">Открытый огонь</Badge>
              </div>
            </div>

            <div className="grid gap-6">
              {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                          <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                          {item.popular && (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              <Heart className="h-3 w-3 mr-1" />
                              Популярное
                            </Badge>
                          )}
                          {item.signature && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              <Flame className="h-3 w-3 mr-1" />
                              Фирменное
                            </Badge>
                          )}
                        </div>
                        <span className="text-2xl font-bold text-foreground">${item.price}</span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.category === "Вегетарианское" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Вегетарианское
                            </Badge>
                          )}
                        </div>
                        
                        <Button className="bg-red-600 hover:bg-red-700">
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
                  🔥 Дровяная печь
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Настоящая неаполитанская печь, работающая на дубовых дровах. 
                  Температура 450°C для идеальной пиццы за 90 секунд.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🥩 BBQ коптильня
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Профессиональная коптильня для медленного копчения мяса. 
                  Процесс занимает до 12 часов для идеального результата.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🔥 Открытый огонь
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Грили на открытом огне для морепродуктов и овощей. 
                  Максимальный жар и неповторимый аромат дымка.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SmokeSector;