import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Coffee,
  Clock,
  MapPin,
  Star,
  Truck,
  Utensils,
  Heart,
  Users,
} from 'lucide-react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import Footer from '@/components/Footer';

const Breakfast = () => {
  const breakfastOptions = [
    {
      title: 'Breakfast in Hall',
      description: 'Enjoy breakfast in our beautiful food hall',
      icon: Coffee,
      time: '7:00 - 11:00',
      price: 'From 150₽',
      features: ['Fresh coffee', 'Pastries', 'Hot breakfast', 'Juices'],
    },
    {
      title: 'Villa Delivery',
      description: 'Breakfast delivered to your villa',
      icon: Truck,
      time: '7:00 - 10:00',
      price: 'From 200₽',
      features: [
        'Free delivery',
        'Hot food',
        'Fresh ingredients',
        'Custom orders',
      ],
    },
  ];

  const menuItems = [
    {
      name: 'Avocado Toast',
      price: '180₽',
      description: 'Sourdough bread, avocado, cherry tomatoes',
    },
    {
      name: 'Pancakes',
      price: '220₽',
      description: 'Fluffy pancakes with maple syrup',
    },
    {
      name: 'Eggs Benedict',
      price: '280₽',
      description: 'Poached eggs, hollandaise sauce',
    },
    {
      name: 'Smoothie Bowl',
      price: '190₽',
      description: 'Acai bowl with fresh fruits',
    },
    {
      name: 'Breakfast Burrito',
      price: '250₽',
      description: 'Scrambled eggs, bacon, cheese',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <ImprovedNavigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Coffee className="h-16 w-16 text-orange-500 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Breakfast at ODE
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start your day with our delicious breakfast options. Enjoy in our
            food hall or have it delivered to your villa.
          </p>
        </div>

        {/* Breakfast Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose Your Breakfast Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {breakfastOptions.map((option, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <option.icon className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{option.title}</CardTitle>
                      <p className="text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{option.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">{option.price}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">What's included:</h4>
                    <div className="flex flex-wrap gap-2">
                      {option.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Menu */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Breakfast Menu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <span className="font-bold text-orange-600">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Add to Order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Villa Delivery Info */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
            <CardContent className="p-12">
              <div className="text-center">
                <Truck className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">
                  Villa Delivery Service
                </h2>
                <p className="text-xl mb-6 max-w-3xl mx-auto">
                  We deliver fresh breakfast directly to your villa. Perfect for
                  a relaxing morning in your private space.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Free Delivery</h3>
                    <p className="text-sm">Within 5km radius</p>
                  </div>
                  <div>
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold">30 min Delivery</h3>
                    <p className="text-sm">Fast and fresh</p>
                  </div>
                  <div>
                    <Heart className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Made with Love</h3>
                    <p className="text-sm">Fresh ingredients</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Day?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your breakfast experience and enjoy the best start to your day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Coffee className="h-5 w-5 mr-2" />
              Order Breakfast
            </Button>
            <Button size="lg" variant="outline">
              <Truck className="h-5 w-5 mr-2" />
              Villa Delivery
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Breakfast;
