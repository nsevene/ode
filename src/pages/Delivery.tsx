import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Clock, 
  MapPin, 
  Star, 
  Utensils,
  Phone,
  CreditCard,
  Shield
} from 'lucide-react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import Footer from '@/components/Footer';

const Delivery = () => {
  const deliveryZones = [
    {
      name: "Zone 1 - Central",
      description: "City center and nearby areas",
      deliveryTime: "15-25 min",
      fee: "Free",
      radius: "2km"
    },
    {
      name: "Zone 2 - Extended",
      description: "Suburban areas",
      deliveryTime: "25-35 min",
      fee: "50₽",
      radius: "5km"
    },
    {
      name: "Zone 3 - Remote",
      description: "Outer areas and villas",
      deliveryTime: "35-45 min",
      fee: "100₽",
      radius: "10km"
    }
  ];

  const deliveryFeatures = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Average delivery time 20-30 minutes"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Contactless delivery and secure payment"
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "Fresh food delivered hot and ready"
    },
    {
      icon: Phone,
      title: "Live Tracking",
      description: "Track your order in real-time"
    }
  ];

  const popularItems = [
    { name: "Margherita Pizza", price: "450₽", rating: 4.8, deliveryTime: "20 min" },
    { name: "Pad Thai", price: "380₽", rating: 4.7, deliveryTime: "15 min" },
    { name: "Burger Deluxe", price: "520₽", rating: 4.9, deliveryTime: "25 min" },
    { name: "Sushi Set", price: "680₽", rating: 4.6, deliveryTime: "30 min" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <ImprovedNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Truck className="h-16 w-16 text-blue-500 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Food Delivery
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Enjoy ODE Food Hall's delicious cuisine delivered directly to your door. 
            Fast, fresh, and convenient delivery service.
          </p>
        </div>

        {/* Delivery Zones */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Delivery Zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryZones.map((zone, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{zone.name}</CardTitle>
                  <p className="text-gray-600">{zone.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivery Time:</span>
                    <Badge variant="outline">{zone.deliveryTime}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivery Fee:</span>
                    <Badge className={zone.fee === "Free" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {zone.fee}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Radius:</span>
                    <span className="font-medium">{zone.radius}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Delivery Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Delivery?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-100 rounded-full">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Items */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Delivery Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.deliveryTime}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">{item.price}</span>
                    <Button size="sm" variant="outline">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                <p className="text-xl">Simple steps to get your food delivered</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Choose Your Food</h3>
                  <p className="text-sm">Browse our menu and select your favorite dishes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Place Your Order</h3>
                  <p className="text-sm">Add items to cart and proceed to checkout</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Track & Receive</h3>
                  <p className="text-sm">Track your order and enjoy your meal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our full menu and place your delivery order now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Utensils className="h-5 w-5 mr-2" />
              Browse Menu
            </Button>
            <Button size="lg" variant="outline">
              <Phone className="h-5 w-5 mr-2" />
              Call to Order
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Delivery;
