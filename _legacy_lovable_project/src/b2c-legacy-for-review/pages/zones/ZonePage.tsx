import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, MapPin, Sparkles } from 'lucide-react';
import { ZONES, BRAND_CANON } from '@/lib/brand';
import ZoneCTA from '@/components/ZoneCTA';
import FooterPolicy from '@/components/FooterPolicy';
import PolicyBadges from '@/components/PolicyBadges';
// import { trackPolicyView } from '@/lib/analytics';

const zoneData = {
  ferment: {
    title: 'Ferment Sector',
    emoji: '🧪',
    description:
      'Исследуйте древние технологии ферментации и современную науку о пробиотиках',
    longDescription:
      'Зона ферментации - это место, где традиции встречаются с инновациями. Здесь вы познакомитесь с древними техниками брожения, попробуете живые культуры и узнаете о пользе ферментированных продуктов для здоровья.',
    experiences: [
      'Мастер-класс по приготовлению кимчи',
      'Дегустация ферментированных напитков',
      'Знакомство с чайным грибом',
      'Процесс изготовления мисо пасты',
    ],
    venue: '1F — AC зона',
    timing: 'Ежедневно 10:00-22:00',
    avgTime: '20-30 минут',
    color: 'from-emerald-500 to-teal-600',
  },
  smoke: {
    title: 'Smoke Sector',
    emoji: '🔥',
    description: 'Познайте искусство копчения и барбекю традиций разных стран',
    longDescription:
      'Дымная зона раскрывает секреты копчения от техасского барбекю до азиатских техник горячего дыма. Здесь каждый кусок мяса, рыбы или овощей обретает уникальный аромат и вкус.',
    experiences: [
      'Техники холодного и горячего копчения',
      'Дегустация копчёных деликатесов',
      'Подбор дров для разных продуктов',
      'Мастер-класс по барбекю',
    ],
    venue: '2F — Alcohol Lounge',
    timing: 'Ежедневно 12:00-23:00',
    avgTime: '25-35 минут',
    color: 'from-orange-500 to-red-600',
  },
  spice: {
    title: 'Spice Sector',
    emoji: '🌶️',
    description:
      'Путешествие по вкусовым традициям Азии через специи и пряности',
    longDescription:
      'Острая зона - это калейдоскоп вкусов и ароматов. От мягких индийских карри до огненных тайских чили, здесь вы откроете для себя богатство азиатской кухни и науку о специях.',
    experiences: [
      'Дегустация специй по уровням остроты',
      'История торговых путей специй',
      'Приготовление собственной смеси карри',
      'Техники балансировки острых вкусов',
    ],
    venue: '1F-2F — Multi-level',
    timing: 'Ежедневно 11:00-22:00',
    avgTime: '15-25 минут',
    color: 'from-red-500 to-pink-600',
  },
  umami: {
    title: 'Umami Sector',
    emoji: '🌊',
    description:
      'Глубокое погружение в пятый вкус - умами и морские деликатесы',
    longDescription:
      'Зона умами посвящена самому загадочному из пяти основных вкусов. Морские водоросли, выдержанные сыры, грибы и другие продукты раскроют секреты глубокого, насыщенного вкуса.',
    experiences: [
      'Научное объяснение вкуса умами',
      'Дегустация морских деликатесов',
      'Техники выдержки и ферментации',
      'Создание умами-бомб в блюдах',
    ],
    venue: '1F — Premium Zone',
    timing: 'Ежедневно 10:00-21:00',
    avgTime: '30-40 минут',
    color: 'from-blue-500 to-indigo-600',
  },
  'sweet-salt': {
    title: 'Sweet-Salt Sector',
    emoji: '🍯',
    description: 'Гармония контрастов: сладкое и солёное в идеальном балансе',
    longDescription:
      'Зона сладко-солёного вкуса исследует удивительные сочетания, которые создают кулинарную магию. От карамелизированного лука до солёной карамели - откройте секреты баланса.',
    experiences: [
      'Создание карамели с морской солью',
      'Дегустация сладко-солёных десертов',
      'Техники карамелизации',
      'Балансировка контрастных вкусов',
    ],
    venue: '1F — Dessert Corner',
    timing: 'Ежедневно 09:00-22:00',
    avgTime: '20-30 минут',
    color: 'from-amber-500 to-yellow-600',
  },
  'sour-herb': {
    title: 'Sour-Herb Sector',
    emoji: '🌿',
    description: 'Свежесть кислинки и ароматы трав в кулинарной симфонии',
    longDescription:
      'Кисло-травяная зона посвящена свежести и яркости вкусов. Здесь вы узнаете о ферментации, маринадах, свежих травах и том, как кислинка может преобразить любое блюдо.',
    experiences: [
      'Приготовление ферментированных солений',
      'Дегустация травяных настоев',
      'Техники маринования',
      'Создание кислых заправок и соусов',
    ],
    venue: '1F — Garden Zone',
    timing: 'Ежедневно 10:00-21:00',
    avgTime: '25-35 минут',
    color: 'from-green-500 to-lime-600',
  },
  'zero-waste': {
    title: 'Zero-Waste Sector',
    emoji: '♻️',
    description: 'Экологичная кулинария: используем продукты на 100%',
    longDescription:
      'Зона безотходного производства показывает, как можно использовать каждую часть продукта. От овощных очисток до костного бульона - здесь каждый ингредиент имеет ценность.',
    experiences: [
      'Готовка из "отходов" - очистки, стебли, кости',
      'Техники сохранения и консервации',
      'Создание бульонов и экстрактов',
      'Устойчивые практики в кулинарии',
    ],
    venue: '1F — Eco Kitchen',
    timing: 'Ежедневно 11:00-20:00',
    avgTime: '35-45 минут',
    color: 'from-green-600 to-emerald-700',
  },
};

export default function ZonePage() {
  const { zone } = useParams<{ zone: string }>();

  if (!zone || !ZONES.includes(zone as any)) {
    return <Navigate to="/taste-compass" replace />;
  }

  const data = zoneData[zone as keyof typeof zoneData];

  // Track policy view
  React.useEffect(() => {
    // trackPolicyView(zone);
  }, [zone]);

  return (
    <>
      <Helmet>
        <title>
          {data.title} | {BRAND_CANON}
        </title>
        <meta name="description" content={data.description} />
        <meta property="og:title" content={`${data.title} | ${BRAND_CANON}`} />
        <meta property="og:description" content={data.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Hero Section */}
        <div
          className={`bg-gradient-to-br ${data.color} text-white relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-6 py-16">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/20 mb-8"
            >
              <a href="/taste-compass">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к Taste Compass
              </a>
            </Button>

            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl">{data.emoji}</span>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  Taste Compass
                </Badge>
              </div>

              <h1 className="text-5xl font-bold mb-6">{data.title}</h1>

              {/* Policy Badges */}
              <div className="mb-6">
                {data.venue.includes('1F') && (
                  <PolicyBadges acHalal serviceFee5 noBYO noRetail />
                )}
                {data.venue.includes('2F') &&
                  data.venue.includes('Alcohol') && (
                    <PolicyBadges alcoholAllowed serviceFee5 />
                  )}
              </div>

              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                {data.description}
              </p>

              <ZoneCTA zone={zone} variant="card" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-6">О зоне</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {data.longDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Experiences */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 mr-3 text-primary" />
                    Что вас ждёт
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {data.experiences.map((experience, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">
                          {experience}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Информация</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{data.venue}</div>
                        <div className="text-sm text-muted-foreground">
                          Расположение
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{data.timing}</div>
                        <div className="text-sm text-muted-foreground">
                          Время работы
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{data.avgTime}</div>
                        <div className="text-sm text-muted-foreground">
                          Среднее время
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card
                className={`bg-gradient-to-br ${data.color} text-white border-none`}
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Готовы начать?</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Получите цифровой штамп в PWA приложении
                  </p>
                  <ZoneCTA zone={zone} variant="minimal" showBadge={false} />
                </CardContent>
              </Card>

              {/* Other Zones */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Другие зоны</h3>
                  <div className="space-y-2">
                    {ZONES.filter((z) => z !== zone)
                      .slice(0, 3)
                      .map((otherZone) => {
                        const otherData =
                          zoneData[otherZone as keyof typeof zoneData];
                        return (
                          <Button
                            key={otherZone}
                            variant="ghost"
                            size="sm"
                            asChild
                            className="w-full justify-start"
                          >
                            <a href={`/zones/${otherZone}`}>
                              <span className="mr-2">{otherData.emoji}</span>
                              {otherData.title}
                            </a>
                          </Button>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer Policy */}
        <div className="border-t bg-muted/30">
          <div className="container mx-auto px-6 py-8">
            <FooterPolicy />
          </div>
        </div>
      </div>
    </>
  );
}
