import React from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Recycle, Target, TrendingUp, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Sustainability = () => {
  const isMobile = useIsMobile();

  const partners = [
    {
      name: "LYD Organic Farm",
      description: "Поставщик органических продуктов с ферм Бали",
      impact: "100% органические ингредиенты",
      icon: Leaf
    },
    {
      name: "Bali Recycling",
      description: "Переработка и утилизация отходов",
      impact: "95% отходов перерабатывается",
      icon: Recycle
    }
  ];

  const kpis = [
    { metric: "Zero Waste", value: "95%", description: "отходов перерабатывается" },
    { metric: "Local Sourcing", value: "80%", description: "продуктов от местных поставщиков" },
    { metric: "Organic Ingredients", value: "100%", description: "в Zero-Waste секторе" },
    { metric: "Water Conservation", value: "40%", description: "экономия воды" }
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
                Sustainability
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                От балийских корней к глобальным маршрутам — с заботой о планете
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="mb-12">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">Tri Hita Karana Philosophy</CardTitle>
                <CardDescription className="text-lg">
                  Гармония с природой, людьми и духовностью — основа нашей устойчивости
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Parahyangan</h3>
                    <p className="text-sm text-muted-foreground">Гармония с духовностью</p>
                  </div>
                  <div className="text-center">
                    <Leaf className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Palemahan</h3>
                    <p className="text-sm text-muted-foreground">Гармония с природой</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Pawongan</h3>
                    <p className="text-sm text-muted-foreground">Гармония с людьми</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Partners */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Наши партнеры</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {partners.map((partner, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <partner.icon className="w-12 h-12 text-primary" />
                      <div>
                        <CardTitle>{partner.name}</CardTitle>
                        <CardDescription>{partner.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{partner.impact}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Zero-Waste KPI & Impact</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <Target className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-sm">{kpi.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">{kpi.value}</div>
                    <p className="text-sm text-muted-foreground">{kpi.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Zero-Waste Sector */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Zero-Waste Sector</CardTitle>
                <CardDescription>Botanical Lab & Chill — лаборатория устойчивости</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Botanical Lab</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Ферментация и компост на месте</li>
                      <li>• Выращивание микрозелени</li>
                      <li>• Создание натуральных ароматизаторов</li>
                      <li>• Переработка органических отходов</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Impact Reporting</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Ежемесячные отчёты по отходам</li>
                      <li>• Мониторинг углеродного следа</li>
                      <li>• Отслеживание водопотребления</li>
                      <li>• Оценка местного sourcing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sunday Market */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Sunday Market</CardTitle>
                <CardDescription>Фермерский маркет каждое воскресенье 07:00–09:00</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="mb-6">
                    Прямые поставки от фермеров Бали, органические продукты, 
                    традиционные ремёсла и знакомство с производителями.
                  </p>
                  <Badge variant="outline" className="text-lg px-6 py-2">
                    Каждое воскресенье 07:00–09:00
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Sustainability;