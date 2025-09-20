import React from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Smartphone,
} from 'lucide-react';
import LazyGoogleMap from '@/components/LazyGoogleMap';
import ContactSection from '@/components/ContactSection';
import { useIsMobile } from '@/hooks/use-mobile';

const Contact = () => {
  const isMobile = useIsMobile();

  const faqItems = [
    {
      question: 'Как работает NFC-паспорт Taste Quest?',
      answer:
        "Сканируйте NFC-метки в каждом из 8 вкусовых секторов. После 4 сканов получаете скидку на Chef's Table, после 8 сканов — VIP-доступ и подарок.",
    },
    {
      question: 'Зоны и время доставки',
      answer:
        'Доставляем по Чангу, Семиньяку и Убуду. Время доставки: 30-60 минут. Breakfast for Villas доставляем к 08:00-09:00.',
    },
    {
      question: "Как забронировать Chef's Table?",
      answer:
        'Бронирование через сайт или WhatsApp. 6-course ужин проходит с 17:00–19:30. Возможны винные и безалкогольные сеты.',
    },
    {
      question: 'Можно ли арендовать пространства?',
      answer:
        'Да! OdeGarden доступен для аренды в свободные часы. Taste Garden используется для мастер-классов и событий.',
    },
    {
      question: 'Есть ли вегетарианские опции?',
      answer:
        'В секторах Ferment и Sour-Herb полностью вегетарианское меню. Также доступны веганские опции в других секторах.',
    },
  ];

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/6281943286395',
      color: 'text-green-600',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/odefoodhall',
      color: 'text-pink-600',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/odefoodhall',
      color: 'text-blue-600',
    },
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
                Contact & FAQ
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Найдите нас, свяжитесь с нами, узнайте больше
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Address & Hours */}
              <Card>
                <CardContent className="p-6">
                  <ContactSection />
                </CardContent>
              </Card>

              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Связаться с нами</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">+62 819 432 863 95</p>
                      <p className="text-sm text-muted-foreground">
                        Звонки и WhatsApp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">selena@odefoodhall.com</p>
                      <p className="text-sm text-muted-foreground">
                        Общие вопросы
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">selena@odefoodhall.com</p>
                      <p className="text-sm text-muted-foreground">
                        Бронирование и события
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Media */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Социальные сети</CardTitle>
                <CardDescription>
                  Следите за новостями и событиями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <Button key={index} variant="outline" asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <social.icon className={`w-5 h-5 ${social.color}`} />
                        {social.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Map */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Как нас найти
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="h-96 rounded-lg overflow-hidden">
                  <LazyGoogleMap />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Часто задаваемые вопросы
            </h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Services Tags */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Наши сервисы
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary">NFC Taste Quest</Badge>
              <Badge variant="secondary">Доставка</Badge>
              <Badge variant="secondary">Breakfast for Villas</Badge>
              <Badge variant="secondary">Chef's Table</Badge>
              <Badge variant="secondary">Аренда пространств</Badge>
              <Badge variant="secondary">Pop-Up Events</Badge>
              <Badge variant="secondary">Sunday Market</Badge>
              <Badge variant="secondary">Мастер-классы</Badge>
              <Badge variant="secondary">Йога</Badge>
              <Badge variant="secondary">Wine Tastings</Badge>
              <Badge variant="secondary">Live Music</Badge>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
