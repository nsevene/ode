import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Car, Utensils, Clock, Phone, Users } from 'lucide-react';

const FAQ_DATA = [
  {
    question: 'Where is ODE Food Hall located?',
    answer:
      'We are located in the heart of Ubud, Bali. Address: Jl. Monkey Forest Rd, Ubud, Kabupaten Gianyar, Bali 80571, Indonesia. Easy walking distance from Ubud center.',
    icon: MapPin,
    category: 'location',
  },
  {
    question: 'What are ODE Food Hall opening hours?',
    answer:
      'Daily from 11:00 to 22:00. Wine staircase is open until 23:00 on Friday and Saturday. Some corners may have individual schedules.',
    icon: Clock,
    category: 'hours',
  },
  {
    question: 'Is there parking available?',
    answer:
      'Yes, we have free parking for motorcycles and bicycles. Car parking is limited, we recommend coming by motorbike or on foot.',
    icon: Car,
    category: 'parking',
  },
  {
    question: 'Do I need to book a table?',
    answer:
      "Booking is recommended, especially for Chef's Table and wine tastings. For regular dining you can walk-in, but it's better to book in advance on weekends.",
    icon: Phone,
    category: 'booking',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept cash (IDR, USD), all major credit cards, and local payment systems (GoPay, OVO, DANA). Some corners accept cryptocurrencies.',
    icon: Users,
    category: 'payment',
  },
  {
    question: 'Is there halal, vegan and gluten-free food?',
    answer:
      'Yes! We have specially certified halal corners, rich selection of vegan dishes and gluten-free options. All dishes are marked with corresponding icons in the menu.',
    icon: Utensils,
    category: 'dietary',
  },
  {
    question: 'What is Taste Compass?',
    answer:
      'Taste Compass is an interactive culinary quest through all 12 corners of our food hall. Get a digital passport, collect achievements and earn rewards for visiting different world cuisines.',
    icon: MapPin,
    category: 'experience',
  },
  {
    question: 'Do you accept large groups?',
    answer:
      'Yes, we accept groups up to 20 people. For groups of 10+ people we recommend advance booking and can organize special set menus or master classes.',
    icon: Users,
    category: 'groups',
  },
];

const FAQSection = () => {
  // Generate Schema.org JSON-LD for FAQ
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <section className="py-16 bg-gradient-to-b from-pure-white to-cream/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-charcoal">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
              Answers to the most popular questions about visiting ODE Food Hall
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Useful Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {FAQ_DATA.map((faq, index) => {
                    const IconComponent = faq.icon;
                    return (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary transition-colors">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-2 pb-4 pl-8">
                          <p className="leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <div className="mt-8 text-center p-6 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Didn't find the answer to your question?
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact us and we'll be happy to help you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/6281943286395"
                    className="inline-flex items-center gap-2 bg-forest-green hover:bg-forest-green/90 text-cream-light px-6 py-3 rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp: +62 819 43286395
                  </a>
                  <a
                    href="mailto:selena@odefoodhall.com"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors"
                  >
                    Email: selena@odefoodhall.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
