import ImprovedNavigation from '@/components/ImprovedNavigation';
import TimeslotBooking from '@/components/TimeslotBooking';
import LoyaltyCard from '@/components/LoyaltyCard';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Music,
  Sparkles,
  Users,
  Clock,
  Star,
  Mic,
  Wine,
  Calendar,
  Sunset,
  Coffee,
  ShoppingBag,
  Wifi,
  MapPin,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Lounge = () => {
  const events = [
    {
      day: 'Monday',
      time: '19:00 - 22:00',
      event: 'Jazz Night',
      artist: 'Bali Jazz Collective',
      type: 'Live Music',
      cover: '$15',
    },
    {
      day: 'Tuesday',
      time: '20:00 - 23:00',
      event: 'Wine & Acoustic',
      artist: 'Local Singer-Songwriters',
      type: 'Acoustic',
      cover: '$10',
    },
    {
      day: 'Wednesday',
      time: '19:30 - 22:30',
      event: 'DJ Night',
      artist: 'DJ Tropical Vibes',
      type: 'Electronic',
      cover: '$12',
    },
    {
      day: 'Thursday',
      time: '20:00 - 23:00',
      event: 'World Music Night',
      artist: 'Gamelan Fusion',
      type: 'World',
      cover: '$18',
    },
    {
      day: 'Friday',
      time: '19:00 - 01:00',
      event: 'Weekend Kickoff',
      artist: 'Live Band + DJ',
      type: 'Mixed',
      cover: '$25',
    },
    {
      day: 'Saturday',
      time: '18:00 - 01:00',
      event: 'Premium Night',
      artist: 'International Artists',
      type: 'Premium',
      cover: '$35',
    },
    {
      day: 'Sunday',
      time: '17:00 - 21:00',
      event: 'Sunset Sessions',
      artist: 'Chill Acoustic',
      type: 'Acoustic',
      cover: '$8',
    },
  ];

  const loungeFeatures = [
    {
      icon: <Music className="h-8 w-8 text-gold-accent" />,
      title: 'Live Entertainment',
      description:
        'World-class musicians, DJs, and performers every night of the week',
    },
    {
      icon: <Wine className="h-8 w-8 text-gold-accent" />,
      title: 'Premium Bar',
      description:
        'Craft cocktails, premium spirits, and exclusive wine selections',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-gold-accent" />,
      title: 'VIP Experience',
      description: 'Private booths, bottle service, and personalized attention',
    },
    {
      icon: <Users className="h-8 w-8 text-gold-accent" />,
      title: 'Social Hub',
      description: 'Perfect for celebrations, dates, and networking events',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>
          Second Floor Lounge | ODE Food Hall Ubud — Premium Nightlife
          Experience
        </title>
        <meta
          name="description"
          content="Elevate your evening at our premium lounge with live music, craft cocktails, and stunning jungle views. The ultimate nightlife destination in Ubud."
        />
      </Helmet>

      <ImprovedNavigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/lovable-uploads/d83cc98e-b461-4440-8991-869f626494cf.png')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-burgundy-primary/60 via-purple-900/40 to-gold-accent/50"></div>
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-accent rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-burgundy-primary rounded-full animate-pulse delay-300"></div>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <Sparkles className="h-24 w-24 mx-auto text-gold-accent animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-burgundy-primary to-gold-accent bg-clip-text text-transparent">
              Second Floor Lounge
            </span>
          </h1>
          <p className="text-2xl md:text-3xl mb-8 font-light text-muted-foreground">
            Where Tropical Elegance Meets Premium Nightlife
          </p>
          <p className="text-xl mb-12 max-w-4xl mx-auto leading-relaxed text-muted-foreground">
            Ascend to our exclusive second-floor lounge for an elevated evening
            experience. Live music, craft cocktails, and breathtaking jungle
            views create the perfect atmosphere for unforgettable nights.
          </p>

          <div className="max-w-lg mx-auto">
            <TimeslotBooking
              experienceType="vip-lounge"
              experienceTitle="Second Floor Lounge"
              maxGuests={8}
            />
          </div>
        </div>
      </section>

      {/* Weekly Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Weekly{' '}
              <span className="bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent">
                Entertainment
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every night brings a new experience with carefully curated
              entertainment and premium atmosphere.
            </p>
          </div>

          <div className="grid gap-4 mb-16">
            {events.map((event, index) => (
              <Card
                key={index}
                className="group hover:shadow-[var(--shadow-tropical)] transition-all duration-500 bg-card border-gold-accent/20"
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="text-center md:text-left">
                      <h3 className="text-lg font-bold text-foreground">
                        {event.day}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {event.time}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="text-xl font-semibold text-foreground mb-1">
                        {event.event}
                      </h4>
                      <p className="text-muted-foreground">{event.artist}</p>
                    </div>

                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className="border-gold-accent/30"
                      >
                        {event.type}
                      </Badge>
                    </div>

                    <div className="text-center md:text-right">
                      <div className="text-lg font-bold text-burgundy-primary mb-2">
                        {event.cover}
                      </div>
                      <Button variant="earth" size="sm">
                        Reserve Table
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Lounge Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {loungeFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-[var(--shadow-tropical)] transition-all duration-500 bg-card border-gold-accent/20"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-burgundy-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* VIP Packages */}
          <div className="bg-gradient-to-r from-burgundy-primary/10 to-purple-600/10 rounded-2xl p-8 border border-gold-accent/20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                VIP Experience Packages
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Elevate your lounge experience with our exclusive VIP packages
                designed for special occasions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-gold-accent/30 bg-card/50">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-gold-accent mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-3">
                    Group Package
                  </h4>
                  <div className="text-2xl font-bold text-burgundy-primary mb-3">
                    $200
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li>• Reserved table for 4-6 people</li>
                    <li>• Welcome cocktails</li>
                    <li>• Priority seating</li>
                    <li>• Dedicated service</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Book Package
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-burgundy-primary bg-burgundy-primary/5 transform scale-105">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-burgundy-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-3">
                    Premium VIP
                  </h4>
                  <div className="text-2xl font-bold text-burgundy-primary mb-3">
                    $400
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li>• Private booth for 6-8 people</li>
                    <li>• Bottle service included</li>
                    <li>• Personal host</li>
                    <li>• Complimentary appetizers</li>
                  </ul>
                  <Button variant="burgundy" className="w-full">
                    Book VIP
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gold-accent/30 bg-card/50">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-gold-accent mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-3">
                    Event Package
                  </h4>
                  <div className="text-2xl font-bold text-burgundy-primary mb-3">
                    Custom
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li>• Private event space</li>
                    <li>• Custom entertainment</li>
                    <li>• Tailored menu</li>
                    <li>• Event coordination</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Zone Experiences */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Атмосферные{' '}
              <span className="bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent">
                Зоны
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Каждый час — свой вайб. Каждая зона — свое настроение.
            </p>
            <div className="text-lg text-muted-foreground max-w-4xl mx-auto italic">
              "Это пространство не давит. Оно слушает."
            </div>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {/* Morning Zone - Yoga & Meditation */}
            <Card className="group overflow-hidden bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/30">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">🧘‍♀️</div>
                      <Badge
                        variant="outline"
                        className="border-emerald-300/50 text-emerald-700"
                      >
                        Пн–Сб, 07:00–09:00
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
                      Йога и медитация
                    </h3>
                    <p className="text-lg text-emerald-700 dark:text-emerald-400 mb-6 italic">
                      "Ты просыпаешься не от кофе, а от дыхания. Каждое движение
                      — как шаг внутрь себя."
                    </p>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Тишина перед началом дня, мягкий свет</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Ощущение очищения и перезагрузки</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Баланс между телом и пространством</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <div className="text-6xl lg:text-8xl opacity-20 font-bold text-emerald-600">
                      07:00
                    </div>
                    <p className="text-sm text-emerald-600 italic mt-4">
                      Птицы просыпаются вместе с тобой. Мир ещё не спешит — и ты
                      тоже.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sunday Market */}
            <Card className="group overflow-hidden bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200/30">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="lg:order-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">🛍</div>
                      <Badge
                        variant="outline"
                        className="border-orange-300/50 text-orange-700"
                      >
                        По воскресеньям, утро
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-orange-800 dark:text-orange-300 mb-4">
                      Sunday Market
                    </h3>
                    <p className="text-lg text-orange-700 dark:text-orange-400 mb-6 italic">
                      "Здесь не покупают. Здесь встречаются. Улыбаются. Пробуют.
                      Общаются."
                    </p>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-orange-400" />
                        <span>Деревенский рынок в Убуде, только без пыли</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-400" />
                        <span>Живое общение, натуральные ароматы</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span>Ощущение субботника на Бали</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:order-1">
                    <div className="text-6xl lg:text-8xl opacity-20 font-bold text-orange-600">
                      ☀️
                    </div>
                    <p className="text-sm text-orange-600 italic mt-4">
                      И уносят с собой не только авокадо, но и чувство — что был
                      в настоящем.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coworking Space */}
            <Card className="group overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">💻</div>
                      <Badge
                        variant="outline"
                        className="border-blue-300/50 text-blue-700"
                      >
                        Ежедневно
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                      Коворкинг с кондиционером
                    </h3>
                    <p className="text-lg text-blue-700 dark:text-blue-400 mb-6 italic">
                      "За окном листья. Внутри — прохлада. И ты. С ноутом, идеей
                      и чашкой балийского кофе."
                    </p>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-blue-400" />
                        <span>Лёгкая тишина, спокойная продуктивность</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-blue-400" />
                        <span>Не офис, не кафе, а гибрид — ты в зоне</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>Работаю — но не забываю, что я на Бали</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <div className="text-6xl lg:text-8xl opacity-20 font-bold text-blue-600">
                      24/7
                    </div>
                    <p className="text-sm text-blue-600 italic mt-4">
                      Никто не мешает. Даже ты себе.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evening Lounge */}
            <Card className="group overflow-hidden bg-gradient-to-br from-burgundy-50/50 to-purple-50/50 dark:from-burgundy-950/20 dark:to-purple-950/20 border-burgundy-200/30">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="lg:order-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">🍷</div>
                      <Badge
                        variant="outline"
                        className="border-burgundy-300/50 text-burgundy-700"
                      >
                        Вечером
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-burgundy-800 dark:text-burgundy-300 mb-4">
                      Лаундж-бар с кальянами
                    </h3>
                    <p className="text-lg text-burgundy-700 dark:text-burgundy-400 mb-6 italic">
                      "Кальян плавно тянется к тебе, вино охлаждается ровно до
                      нужного градуса."
                    </p>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Wine className="w-4 h-4 text-burgundy-400" />
                        <span>Тёплый свет, low beats, дым, разговоры</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-burgundy-400" />
                        <span>Расслабленность без лишней показухи</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-burgundy-400" />
                        <span>Здесь говорят шёпотом и долго</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:order-1">
                    <div className="text-6xl lg:text-8xl opacity-20 font-bold text-burgundy-600">
                      🌃
                    </div>
                    <p className="text-sm text-burgundy-600 italic mt-4">
                      Лестница — не просто декор, а портал в настроения.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sunset Terrace */}
            <Card className="group overflow-hidden bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/30">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">🌇</div>
                      <Badge
                        variant="outline"
                        className="border-amber-300/50 text-amber-700"
                      >
                        После 17:30
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-amber-800 dark:text-amber-300 mb-4">
                      Sunset Terrace
                    </h3>
                    <p className="text-lg text-amber-700 dark:text-amber-400 mb-6 italic">
                      "Солнце медленно опускается за холмы. Ты не хочешь делать
                      фото — ты просто хочешь запомнить."
                    </p>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Sunset className="w-4 h-4 text-amber-400" />
                        <span>Открытое небо, тёплый свет, мягкий ветер</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Романтичная и почти кинематографичная</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Хочу остаться здесь навсегда</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <div className="text-6xl lg:text-8xl opacity-20 font-bold text-amber-600">
                      🌅
                    </div>
                    <p className="text-sm text-amber-600 italic mt-4">
                      Иногда идеальное — это просто сесть и смотреть.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Space */}
            <Card className="group overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200/30">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="lg:order-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">🍽</div>
                      <Badge
                        variant="outline"
                        className="border-violet-300/50 text-violet-700"
                      >
                        150 м²
                      </Badge>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-violet-800 dark:text-violet-300 mb-4">
                      Event Space — Chef's Tables
                    </h3>
                    <p className="text-lg text-violet-700 dark:text-violet-400 mb-6 italic">
                      "Здесь можно собраться вшестером на винный сет. Или
                      сделать pop-up на 50 человек."
                    </p>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-violet-400" />
                        <span>Трансформация. То пусто, то свечи</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span>Подстраивается под событие</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-violet-400" />
                        <span>Эксклюзив, внутренняя кухня</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:order-1">
                    <div className="text-6xl lg:text-8xl opacity-20 font-bold text-violet-600">
                      ∞
                    </div>
                    <p className="text-sm text-violet-600 italic mt-4">
                      Или ничего. Просто дождаться следующей идеи.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-br from-burgundy-primary/5 to-gold-accent/5 border-gold-accent/20 inline-block">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Приходи за одним настроением
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  Ты приходишь утром за дыханием. Остаёшься днём — поработать.
                  Возвращаешься вечером — быть с кем-то. Или с собой.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-burgundy-primary to-gold-accent"
                >
                  Забронировать пространство
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Stats */}
      <section className="py-16 bg-gradient-to-r from-purple-900/5 to-burgundy-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Music className="h-8 w-8 text-burgundy-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">7</div>
              <div className="text-sm text-muted-foreground">
                Nights Per Week
              </div>
            </div>
            <div>
              <Mic className="h-8 w-8 text-burgundy-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div className="text-sm text-muted-foreground">
                Live Performances
              </div>
            </div>
            <div>
              <Star className="h-8 w-8 text-burgundy-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">4.8</div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
            <div>
              <Clock className="h-8 w-8 text-burgundy-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">6hrs</div>
              <div className="text-sm text-muted-foreground">Average Stay</div>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty and Referrals Section */}
      <section className="py-16 bg-gradient-to-r from-burgundy-primary/5 to-gold-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Exclusive Member Benefits
            </h2>
            <p className="text-muted-foreground">
              Earn points, get rewards, and share the experience
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LoyaltyCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lounge;
