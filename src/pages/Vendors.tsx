import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  MapPin, 
  Clock, 
  Star, 
  Users,
  ChefHat,
  TrendingUp,
  Award
} from 'lucide-react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import Footer from '@/components/Footer';

const Vendors = () => {
  const vendorTypes = [
    {
      title: "Long-term Residency",
      description: "Permanent kitchen spaces for established restaurants",
      icon: Store,
      duration: "12+ months",
      features: ["Prime locations", "Full equipment", "Marketing support", "Stable income"]
    },
    {
      title: "Pop-up Kitchen",
      description: "Flexible short-term partnerships for events and trials",
      icon: Clock,
      duration: "1-6 months",
      features: ["Flexible booking", "Event partnerships", "Trial periods", "Quick setup"]
    },
    {
      title: "Food Truck",
      description: "Mobile kitchen solutions for unique concepts",
      icon: MapPin,
      duration: "Flexible",
      features: ["Mobile setup", "Event catering", "Location flexibility", "Lower overhead"]
    }
  ];

  const currentVendors = [
    {
      name: "Dolce Italia",
      cuisine: "Italian",
      rating: 4.8,
      location: "Ground Floor",
      specialty: "Authentic Italian pasta and pizza",
      image: "/images/dolce-italia.jpg"
    },
    {
      name: "Spicy Asia",
      cuisine: "Asian",
      rating: 4.6,
      location: "Ground Floor",
      specialty: "Thai and Vietnamese street food",
      image: "/images/spicy-asia.jpg"
    },
    {
      name: "Wild Bali",
      cuisine: "Indonesian",
      rating: 4.9,
      location: "Ground Floor",
      specialty: "Traditional Balinese cuisine",
      image: "/images/wild-bali.jpg"
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "High Foot Traffic",
      description: "Located in prime location with guaranteed customer flow"
    },
    {
      icon: Users,
      title: "Diverse Audience",
      description: "Access to tourists, locals, and business professionals"
    },
    {
      icon: Award,
      title: "Marketing Support",
      description: "Included marketing and promotional activities"
    },
    {
      icon: ChefHat,
      title: "Professional Setup",
      description: "Fully equipped kitchens with modern appliances"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <ImprovedNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Store className="h-16 w-16 text-purple-500 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Become a Vendor
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join ODE Food Hall as a vendor and be part of Bali's premier culinary destination. 
            Multiple partnership options available for different business needs.
          </p>
        </div>

        {/* Vendor Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Partnership Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vendorTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <type.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <Badge variant="outline">{type.duration}</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600">{type.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">What's included:</h4>
                    <div className="space-y-1">
                      {type.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Current Vendors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Current Vendors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentVendors.map((vendor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <h3 className="font-semibold text-lg mb-2">{vendor.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{vendor.cuisine} • {vendor.location}</p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{vendor.specialty}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ODE Food Hall?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-purple-100 rounded-full">
                      <benefit.icon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">How to Apply</h2>
                <p className="text-xl">Simple steps to join our vendor community</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Submit Application</h3>
                  <p className="text-sm">Fill out our vendor application form</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Review Process</h3>
                  <p className="text-sm">We review your concept and requirements</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Trial Period</h3>
                  <p className="text-sm">Short trial to test the partnership</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Launch</h3>
                  <p className="text-sm">Start your journey with us</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Us?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Become part of Bali's most exciting food destination. 
            Multiple partnership options available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Store className="h-5 w-5 mr-2" />
              Apply Now
            </Button>
            <Button size="lg" variant="outline">
              <MapPin className="h-5 w-5 mr-2" />
              View Floor Plan
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Vendors;
