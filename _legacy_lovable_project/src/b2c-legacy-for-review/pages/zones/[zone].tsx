import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ZoneCTA from '@/components/ZoneCTA';
import FooterPolicy from '@/components/FooterPolicy';
import { ZONES, BRAND_CANON } from '@/lib/brand';
import { Helmet } from 'react-helmet-async';

const zoneData = {
  ferment: {
    title: 'FERMENT',
    emoji: '🧪',
    description: 'Зона ферментации и живых культур',
    details:
      'Исследуйте мир ферментированных продуктов: кимчи, комбуча, мисо и традиционные балийские темпе. Узнайте о пользе пробиотиков и древних техниках консервации.',
  },
  smoke: {
    title: 'SMOKE',
    emoji: '🔥',
    description: 'Зона копчения и гриля',
    details:
      'Погрузитесь в ароматы дымка: копченые морепродукты, мясо на углях и традиционные балийские техники приготовления на огне. Мастер-классы по грилю каждые выходные.',
  },
  spice: {
    title: 'SPICE',
    emoji: '🌶️',
    description: 'Зона специй и пряностей',
    details:
      'Откройте богатство индонезийских специй: от мягкой куркумы до огненного чили. Дегустации и мастер-классы по приготовлению традиционных смесей специй.',
  },
  umami: {
    title: 'UMAMI',
    emoji: '🌊',
    description: 'Зона пятого вкуса',
    details:
      'Разгадайте тайну умами через морские водоросли, грибы шиитаке, рыбные соусы и мисо. Понимание глубинных вкусов азиатской кухни.',
  },
  'sweet-salt': {
    title: 'SWEET-SALT',
    emoji: '🍯',
    description: 'Зона сладко-соленых сочетаний',
    details:
      'Баланс сладкого и соленого: карамель с морской солью, сладкие соевые соусы, тропические фрукты с чили и солью. Искусство контрастов.',
  },
  'sour-herb': {
    title: 'SOUR-HERB',
    emoji: '🌿',
    description: 'Зона кислого и трав',
    details:
      'Свежесть кислых вкусов и ароматных трав: лемонграсс, лайм, тамаринд, базилик и мята. Освежающие сочетания тропической кухни.',
  },
  'zero-waste': {
    title: 'ZERO-WASTE',
    emoji: '♻️',
    description: 'Зона безотходного приготовления',
    details:
      'Устойчивая гастрономия: использование всех частей продуктов, компостирование, локальные ингредиенты. Экологичное будущее кулинарии.',
  },
};

export default function ZonePage() {
  const { zone } = useParams<{ zone: string }>();

  if (!zone || !ZONES.includes(zone as any)) {
    return <Navigate to="/404" replace />;
  }

  const data = zoneData[zone as keyof typeof zoneData];

  return (
    <>
      <Helmet>
        <title>
          {data.title} | {BRAND_CANON}
        </title>
        <meta
          name="description"
          content={`${data.description}. ${data.details}`}
        />
        <meta property="og:title" content={`${data.title} | ${BRAND_CANON}`} />
        <meta property="og:description" content={data.description} />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-burgundy-primary via-charcoal to-burgundy-light">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Header */}
          <div className="text-center text-cream-light">
            <Badge
              variant="secondary"
              className="mb-4 bg-mustard-accent text-charcoal-dark"
            >
              Taste Alley Zone
            </Badge>
            <div className="text-6xl mb-4">{data.emoji}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-mustard-accent to-gold-light bg-clip-text text-transparent">
              {data.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-6">
              {data.description}
            </p>
          </div>

          {/* Content */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-cream-light space-y-6">
                <p className="text-lg leading-relaxed">{data.details}</p>

                <div className="flex justify-center pt-6">
                  <ZoneCTA zone={zone} variant="default" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-cream-light mb-4">
                Как работает Taste Quest
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-cream-light/80 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <p>Найдите NFC-стикер в этой зоне</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <p>Поднесите телефон к стикеру</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <p>Получите штамп в PWA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy */}
          <div className="pt-8">
            <FooterPolicy />
          </div>
        </div>
      </main>
    </>
  );
}
