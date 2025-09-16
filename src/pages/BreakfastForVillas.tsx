import React from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Phone, MessageCircle, FileText, MapPin, Users, Utensils, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BreakfastForVillas = () => {
  const isMobile = useIsMobile();

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I\'d like to learn more about the Breakfast for Villas partnership program.');
    window.open(`https://wa.me/6281339966699?text=${message}`, '_blank');
  };

  const handlePartnerForm = () => {
    // This would typically open a form modal or navigate to a form page
    console.log('Opening partner form...');
  };

  const benefits = [
    "🍳 10 authentic culinary stations under one roof",
    "🏛️ 400+ dining seats across two levels", 
    "📍 Prime Ubud location (between Central Market & Monkey Forest Road)",
    "🌿 Panoramic jungle views, live music, evening events"
  ];

  const targetAudience = [
    "🏡 Private villas & vacation rentals",
    "🏨 Boutique hotels & resorts", 
    "🛏️ B&Bs, guesthouses & retreat centers"
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Setup QR Code",
      description: "We provide you with a unique QR code for your villa's welcome book or reception area"
    },
    {
      step: 2,
      title: "Guest Orders",
      description: "Your guests scan the code and order breakfast directly from our curated menu"
    },
    {
      step: 3,
      title: "We Deliver",
      description: "Professional delivery or pick-up service ensures fresh, hot breakfast arrives on time"
    },
    {
      step: 4,
      title: "You Earn",
      description: "Receive 10% commission on every confirmed breakfast order from your guests"
    }
  ];

  const partnershipBenefits = [
    "🔗 Custom QR codes and branded ordering links",
    "📊 Monthly detailed reports on orders and commissions",
    "📢 Marketing support: Featured in our partner villa directory",
    "🍽️ Custom breakfast packages (e.g., 'Villa Serenity x ODE Morning Set')"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />
      
      <main className={`${isMobile ? 'pb-20' : ''}`}>
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sage-blue/10 via-pure-white to-forest-green/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-gold-accent to-terracotta text-pure-white px-6 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
              🍳 BREAKFAST FOR VILLAS PROGRAM
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
              Premium Breakfast Service.{" "}
              <span className="text-burgundy-primary">For Your Villa Guests.</span>
            </h1>
            <div className="bg-gradient-primary p-6 rounded-2xl mb-8 text-pure-white">
              <p className="text-xl sm:text-2xl font-bold mb-2">
                🥐 AUTHENTIC BALINESE BREAKFAST DELIVERED TO YOUR GUESTS
              </p>
              <p className="text-lg opacity-90">
                Partner with ODE Food Hall to offer gourmet breakfast experiences. We handle everything - you earn 10% commission on every order.
              </p>
            </div>
            
            {/* Hero Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="relative overflow-hidden rounded-2xl shadow-elegant">
                <img 
                  src="/lovable-uploads/bd3a71c1-e62b-465c-9acc-74398d478797.png" 
                  alt="Breakfast for Villas - tropical breakfast setup with rice terraces view"
                  className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-elegant">
                <img 
                  src="/lovable-uploads/0978f285-021e-4828-b1fd-747c3759c976.png" 
                  alt="Villa breakfast experience with fresh tropical fruits and coffee"
                  className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleWhatsApp}
              size="lg" 
              className="bg-gradient-to-r from-terracotta to-burgundy-primary hover:shadow-burgundy text-pure-white px-8 py-4 text-lg font-semibold animate-pulse"
            >
              🚀 Join Breakfast for Villas Program
            </Button>
          </div>
        </section>

        {/* Why Ode Food Hall */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pure-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
                A Space Worth Showing Your Guests
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-sage-blue/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-sage-blue flex-shrink-0 mt-1" />
                      <p className="text-charcoal/80 leading-relaxed">{benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
              Who It's For
            </h2>
            <p className="text-xl text-charcoal/80 mb-8">We work with:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {targetAudience.map((audience, index) => (
                <Card key={index} className="border-sage-blue/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-sage-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {index === 0 && <MapPin className="h-8 w-8 text-sage-blue" />}
                      {index === 1 && <Users className="h-8 w-8 text-sage-blue" />}
                      {index === 2 && <Utensils className="h-8 w-8 text-sage-blue" />}
                    </div>
                    <p className="text-charcoal/80 font-medium">{audience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-pure-white px-6 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                ⚡ HOW IT WORKS
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
                Simple: QR → Order → Breakfast → 💰 Cashback
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <Card key={index} className={`border-2 hover:shadow-xl transition-all transform hover:-translate-y-2 ${
                  index === 3 ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50' : 'border-sage-blue/20'
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${
                      index === 3 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-sage-blue'
                    } text-pure-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg shadow-lg`}>
                      {index === 3 ? '💰' : item.step}
                    </div>
                    <h3 className={`font-semibold mb-2 ${
                      index === 3 ? 'text-emerald-700 text-lg' : 'text-charcoal'
                    }`}>{item.title}</h3>
                    <p className={`text-sm leading-relaxed ${
                      index === 3 ? 'text-emerald-600 font-medium' : 'text-charcoal/70'
                    }`}>{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Role Description */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-pure-white px-6 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                🤝 ROLE DISTRIBUTION
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-8">
                You Direct — We Serve
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-700 text-xl">Your Role:</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-700 font-medium">Direct guests to us for breakfast — via QR, link, or reception</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-700 font-medium">Guests arrange transport through the hotel as convenient for you</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Utensils className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-emerald-700 text-xl">Our Role:</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-700 font-medium">Process orders, serve guests, and track the source</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-200">
                      <TrendingUp className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 font-bold text-lg">You receive 10% from every confirmed order! 💰</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Benefits */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pure-white/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
                Additional Partnership Benefits
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnershipBenefits.map((benefit, index) => (
                <Card key={index} className="border-sage-blue/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-sage-blue flex-shrink-0 mt-1" />
                      <p className="text-charcoal/80 leading-relaxed">{benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-teal-600/90"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-charcoal px-6 py-2 rounded-full text-sm font-bold mb-6 inline-block animate-bounce">
              🔥 LIMITED OFFER 2025
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-pure-white mb-6">
              Ready to Start Earning?
            </h2>
            <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 p-6 rounded-2xl mb-8 text-charcoal">
              <p className="text-xl sm:text-2xl font-bold mb-2">
                💎 FREE SETUP + 24/7 SUPPORT
              </p>
              <p className="text-lg">
                Submit your application — we'll connect you within 24 hours. 
                We'll help with setup, QR codes, materials, and logistics.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleWhatsApp}
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-pure-white px-8 py-4 text-lg font-bold shadow-xl animate-pulse"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                💬 WhatsApp (FAST)
              </Button>
              <Button 
                onClick={handlePartnerForm}
                variant="outline"
                size="lg" 
                className="border-2 border-pure-white text-pure-white hover:bg-pure-white hover:text-blue-600 px-8 py-4 text-lg font-bold shadow-xl"
              >
                <FileText className="h-5 w-5 mr-2" />
                📋 Fill Form
              </Button>
              <Button 
                onClick={handleWhatsApp}
                variant="outline"
                size="lg" 
                className="border-2 border-pure-white text-pure-white hover:bg-pure-white hover:text-blue-600 px-8 py-4 text-lg font-bold shadow-xl"
              >
                <Phone className="h-5 w-5 mr-2" />
                📞 Manager
              </Button>
            </div>
            <div className="mt-8 text-pure-white/90 text-sm">
              <p className="mb-2">⭐ Already 50+ partners across Ubud</p>
              <p>🚀 Average partner income: $200-500/month</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BreakfastForVillas;