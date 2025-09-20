import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Check, Coffee, Truck, Users } from 'lucide-react';

/**
 * Page /breakfast – combines three views inside a single tab component.
 *  - Eat-in      – in-hall breakfast sets
 *  - Villa       – delivery plans for villa guests (default)
 *  - Partner     – B2B landing for villa/hotel owners
 */

export default function BreakfastPage() {
  const [tab, setTab] = useState<string>('eatin');
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* ——— Page Header kept global (Logo + burger) ——— */}
      <section className="container mx-auto py-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-8 flex justify-center gap-2 lg:gap-4">
            <TabsTrigger value="eatin">Eat-in</TabsTrigger>
            <TabsTrigger value="villa">Villa Delivery</TabsTrigger>
            <TabsTrigger value="partner">Become Partner</TabsTrigger>
          </TabsList>

          {/* 1 ————————— Eat-in */}
          <TabsContent value="eatin">
            <Hero
              icon={<Coffee className="h-6 w-6 text-brand-golden" />}
              title="Start Your Morning Inside ODE"
              subtitle="Daily 07:00 – 11:00 • Indoor AC"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eatInSets.map((set) => (
                <BreakfastCard key={set.id} {...set} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button size="lg">Book Table</Button>
            </div>
          </TabsContent>

          {/* 2 ————————— Villa Delivery */}
          <TabsContent value="villa">
            <Hero
              icon={<Truck className="h-6 w-6 text-brand-golden" />}
              title="Premium Breakfast To Your Villa"
              subtitle="Freshly cooked • Delivered 07:00 – 09:00"
            />
            {/* Date + time slot */}
            <div className="mx-auto mb-8 max-w-md">
              <DatePickerWithRange />
            </div>
            {/* Plans */}
            <SectionTitle>Choose Your Plan</SectionTitle>
            <div className="grid gap-6 md:grid-cols-3">
              {deliveryPlans.map((plan) => (
                <PlanCard key={plan.id} {...plan} />
              ))}
            </div>
            {/* Big baskets */}
            <SectionTitle className="mt-16">Special Baskets</SectionTitle>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {baskets.map((b) => (
                <BasketCard key={b.id} {...b} />
              ))}
            </div>
          </TabsContent>

          {/* 3 ————————— Become Partner */}
          <TabsContent value="partner">
            <Hero
              icon={<Users className="h-6 w-6 text-brand-golden" />}
              title="Partner With ODE — Earn 10 %"
              subtitle="Free setup • 24/7 support • 50+ villas already on board"
            />
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
              {benefits.map((b) => (
                <BenefitCard key={b.id} {...b} />
              ))}
            </div>
            <SectionTitle className="mt-16">Revenue Calculator</SectionTitle>
            <RevenueCalculator />
            <PartnerCTA />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

/* —————————————————— Helper sub-components —————————————————— */

type HeroProps = { icon: React.ReactNode; title: string; subtitle: string };
function Hero({ icon, title, subtitle }: HeroProps) {
  return (
    <header className="mb-10 flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-forest/10">
        {icon}
      </div>
      <h1 className="text-3xl font-serif text-brand-forest md:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-lg text-brand-forest/80">{subtitle}</p>
    </header>
  );
}

function SectionTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mb-6 text-2xl font-serif text-brand-forest md:text-3xl ${className}`}
    >
      {children}
    </h2>
  );
}

/*  Dummy data  */
const eatInSets = [
  { id: 1, title: 'Balinese Energy Set', price: 8, badge: 'New' },
  { id: 2, title: 'Protein Power', price: 9 },
  { id: 3, title: 'Vegan Garden', price: 7 },
  { id: 4, title: 'French Toast Bowl', price: 8 },
];

const deliveryPlans = [
  { id: '3d', title: '3-Day Retreat', days: 3, price: 45 },
  { id: '5d', title: '5-Day Workweek', days: 5, price: 65, popular: true },
  { id: '7d', title: '7-Day Bliss', days: 7, price: 85 },
];

const baskets = [
  { id: 'float', title: 'Floating Basket', price: 75 },
  { id: 'honey', title: 'Honeymoon Set', price: 99 },
];

const benefits = [
  {
    id: 1,
    icon: Truck,
    title: 'Daily 500 visitors',
    desc: 'Stable foot traffic',
  },
  { id: 2, icon: Users, title: 'Marketing Kit', desc: 'QR, photos, promos' },
  {
    id: 3,
    icon: Check,
    title: 'Easy 10 %',
    desc: 'Auto-calculated commission',
  },
];

/*  Cards — code shortened for brevity; use shadcn Card UI  */
const BreakfastCard = ({ title, price, badge }: any) => (
  <div className="rounded-xl border bg-white p-4 shadow-sm">
    <div className="h-40 rounded-lg bg-gray-200 mb-3" />
    {badge && (
      <span className="mb-2 inline-block rounded bg-brand-golden/20 px-2 text-xs text-brand-golden">
        {badge}
      </span>
    )}
    <h3 className="font-semibold text-brand-forest">{title}</h3>
    <p className="text-sm text-brand-forest/70">${price.toFixed(2)}</p>
  </div>
);

const PlanCard = ({ title, days, price, popular }: any) => (
  <div
    className={`rounded-xl border bg-white p-6 shadow-sm ${popular ? 'border-brand-golden scale-105' : ''}`}
  >
    {popular && (
      <span className="mb-2 inline-block rounded bg-brand-golden px-3 py-0.5 text-xs font-medium text-brand-forest">
        Most Popular
      </span>
    )}
    <h3 className="mb-1 text-lg font-semibold text-brand-forest">{title}</h3>
    <p className="text-sm text-brand-forest/70">{days} days</p>
    <p className="mt-4 text-3xl font-bold text-brand-forest">${price}</p>
    <Button className="mt-6 w-full bg-brand-golden/90 hover:bg-brand-golden">
      Add to Cart
    </Button>
  </div>
);

const BasketCard = ({ title, price }: any) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <div className="h-32 rounded-lg bg-gray-200 mb-4" />
    <h3 className="font-semibold text-brand-forest">{title}</h3>
    <p className="my-2 text-2xl font-bold text-brand-forest">${price}</p>
    <Button className="w-full bg-brand-forest hover:bg-brand-forest/90">
      Add to Cart
    </Button>
  </div>
);

const BenefitCard = ({ icon: Icon, title, desc }: any) => (
  <div className="flex gap-4 rounded-xl border bg-white p-6 shadow-sm">
    <Icon className="h-8 w-8 text-brand-golden" />
    <div>
      <h3 className="font-semibold text-brand-forest">{title}</h3>
      <p className="text-sm text-brand-forest/70">{desc}</p>
    </div>
  </div>
);

function RevenueCalculator() {
  /* placeholder */
  return (
    <div className="mx-auto mt-6 max-w-lg rounded-xl border bg-white p-6 shadow-sm">
      <p className="mb-4 text-sm text-brand-forest/70">
        Interactive calculator coming soon …
      </p>
    </div>
  );
}

function PartnerCTA() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-center">
      <Button size="lg" className="bg-brand-golden/90 hover:bg-brand-golden">
        WhatsApp (fast)
      </Button>
      <Button variant="outline" size="lg">
        Download PDF
      </Button>
      <Button variant="secondary" size="lg">
        Schedule Call
      </Button>
    </div>
  );
}
