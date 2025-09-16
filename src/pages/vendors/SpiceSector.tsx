import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, Star, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";

const SpiceSector = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      name: "Chicken Tikka Masala",
      description: "Нежная курица в сливочно-томатном соусе с ароматными индийскими специями",
      price: 24,
      image: "/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png",
      category: "Индийская кухня",
      spicyLevel: 2,
      popular: true
    },
    {
      id: 2,
      name: "Thai Green Curry",
      description: "Традиционное тайское зеленое карри с кокосовым молоком и свежими травами",
      price: 22,
      image: "/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png",
      category: "Тайская кухня",
      spicyLevel: 3,
      popular: true
    },
    {
      id: 3,
      name: "Moroccan Tagine",
      description: "Ароматный тажин с бараниной, сухофруктами и смесью марокканских специй",
      price: 28,
      image: "/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png",
      category: "Марокканская кухня",
      spicyLevel: 1,
      popular: false
    },
    {
      id: 4,
      name: "Szechuan Mapo Tofu",
      description: "Острый тофу по-сычуаньски с перцем мала и ароматным маслом",
      price: 20,
      image: "/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png",
      category: "Китайская кухня",
      spicyLevel: 4,
      popular: true
    },
    {
      id: 5,
      name: "Spice Route Sampler",
      description: "Дегустационный набор из 5 блюд разных кухонь Великого шелкового пути",
      price: 32,
      image: "/lovable-uploads/f41aad56-be6e-42c6-b101-46d8f2520a51.png",
      category: "Дегустационное меню",
      spicyLevel: 2,
      popular: true
    }
  ];

  const getSpicyBadge = (level: number) => {
    const spicyLabels = ['Мягкое', 'Умеренно острое', 'Острое', 'Очень острое', 'Огненное'];
    const spicyColors = ['bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800', 'bg-purple-100 text-purple-800'];
    
    return (
      <Badge variant="outline" className={spicyColors[level]}>
        {'🌶️'.repeat(level + 1)} {spicyLabels[level]}
      </Badge>
    );
  };

  const seoData = {
    title: "🌶️ SPICE Sector - Путешествие по Великому шелковому пути | ODE Food Hall",
    description: "Исследуйте экзотические специи и пряности в секторе SPICE. Индийские карри, тайские пасты, марокканские тажины и блюда Великого шелкового пути.",
    keywords: "специи, пряности, острая еда, индийская кухня, тайская кухня, марокканская кухня, карри, шелковый путь, Убуд",
    image: "/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seoData} />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-red-400 to-pink-500 overflow-hidden">
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
              🌶️ SPICE
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Taste the Journey
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mb-6">
              Путешествие по Великому шелковому пути через пряности и специи
            </p>
            
            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>11:00 - 22:00</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Сектор 3, Taste Compass</span>
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
            <h2 className="text-3xl font-bold text-foreground mb-6">О секторе SPICE</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  Сектор SPICE — это кулинарное путешествие по Великому шелковому пути, 
                  где каждое блюдо рассказывает историю торговых караванов и культурного обмена.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Мы собрали самые яркие вкусы Азии, Африки и Ближнего Востока, используя 
                  аутентичные специи и традиционные техники приготовления.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h3 className="font-bold text-2xl text-red-600">50+</h3>
                    <p className="text-sm text-muted-foreground">Видов специй</p>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <h3 className="font-bold text-2xl text-pink-600">8</h3>
                    <p className="text-sm text-muted-foreground">Кухонь мира</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png" 
                  alt="Spices and herbs" 
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
                <Badge variant="outline">Аутентичные рецепты</Badge>
                <Badge variant="outline">Экзотические специи</Badge>
                <Badge variant="outline">5 уровней остроты</Badge>
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
                        </div>
                        <span className="text-2xl font-bold text-foreground">${item.price}</span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline">{item.category}</Badge>
                          {getSpicyBadge(item.spicyLevel)}
                        </div>
                        
                        <Button className="bg-red-500 hover:bg-red-600">
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
                  🌶️ Уровни остроты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Мы предлагаем 5 уровней остроты — от мягкого до огненного. 
                  Каждое блюдо можно адаптировать под ваши предпочтения.
                </p>
                <div className="space-y-1 text-sm">
                  <div>🌶️ Мягкое</div>
                  <div>🌶️🌶️ Умеренно острое</div>
                  <div>🌶️🌶️🌶️ Острое</div>
                  <div>🌶️🌶️🌶️🌶️ Очень острое</div>
                  <div>🌶️🌶️🌶️🌶️🌶️ Огненное</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🏺 Аутентичные специи
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Все специи импортируются напрямую из стран происхождения. 
                  Шафран из Кашмира, кардамон из Гватемалы, корица из Шри-Ланки.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  👨‍🍳 Мастер-классы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Еженедельные мастер-классы по приготовлению карри, смешиванию 
                  специй и секретам кухонь Великого шелкового пути.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpiceSector;