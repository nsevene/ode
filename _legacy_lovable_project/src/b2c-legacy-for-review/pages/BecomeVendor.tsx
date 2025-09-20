import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, DollarSign, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/seo/SEOHead';

const BecomeVendor = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: Users, title: 'High Foot Traffic', desc: '1000+ daily visitors' },
    {
      icon: Zap,
      title: 'Premium Location',
      desc: 'Heart of Ubud culinary scene',
    },
    {
      icon: DollarSign,
      title: 'Revenue Support',
      desc: 'Marketing & operational assistance',
    },
  ];

  const pricingPlans = [
    {
      name: 'Corner Space',
      price: '$2,500',
      period: '/month',
      features: ['15m² space', 'Equipment included', 'Marketing support'],
    },
    {
      name: 'Premium Corner',
      price: '$4,000',
      period: '/month',
      features: ['25m² space', 'Premium location', 'Full marketing package'],
    },
    {
      name: 'Pop-Up Space',
      price: '$150',
      period: '/day',
      features: ['Flexible booking', 'Equipment access', 'Event promotion'],
    },
  ];

  return (
    <>
      <SEOHead
        title="Rent Restaurant Space Ubud Bali | Commercial Kitchen Rental | ODE Food Hall"
        description="Rent restaurant space in Ubud's premier food hall. Commercial kitchen rental, cafe space, land for restaurant business. High foot traffic, equipment included, marketing support. Start your restaurant in Bali today!"
        keywords="rent restaurant space Ubud, rent cafe Ubud, commercial kitchen rental Bali, restaurant space for rent, cafe rental Ubud, land for restaurant Bali, food hall rental, restaurant business opportunity Ubud, commercial space rental Bali"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-b from-forest-green/10 to-cream-light">
        <div className="container mx-auto px-4 py-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-burgundy-primary mb-6 font-display">
              Откройте свой ресторан в Убуде
            </h1>
            <h2 className="text-2xl md:text-3xl text-charcoal mb-4">
              Аренда кухонного пространства в ODE Food Hall
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join Bali's most innovative food hall. Showcase your culinary
              passion to thousands of food enthusiasts.
            </p>
            <Button
              size="lg"
              className="bg-golden hover:bg-golden/90 text-forest"
            >
              Apply Now
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-sage/30">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 text-sage mx-auto mb-4" />
                  <CardTitle className="text-forest">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-forest mb-12">
              Pricing Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className="border-sage/30 hover:border-sage transition-colors"
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-forest text-2xl">
                      {plan.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-sage">
                      {plan.price}
                      <span className="text-lg font-normal">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-sage" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-sage hover:bg-sage/90">
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <Card className="max-w-2xl mx-auto border-sage/30">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-forest">
                Vendor Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Business Name" />
                <Input placeholder="Contact Person" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Email" type="email" />
                <Input placeholder="Phone" />
              </div>
              <Input placeholder="Cuisine Type" />
              <Textarea placeholder="Tell us about your concept..." rows={4} />
              <Button className="w-full bg-golden hover:bg-golden/90 text-forest">
                Submit Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BecomeVendor;
