import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, 
  Star, 
  Clock, 
  Users, 
  Wine,
  Utensils,
  Award,
  Calendar
} from 'lucide-react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import Footer from '@/components/Footer';

const ChefsTable = () => {
  const experienceDetails = [
    {
      course: "Amuse Bouche",
      description: "Welcome bite to start your journey",
      duration: "5 min"
    },
    {
      course: "Appetizer",
      description: "Seasonal ingredients with modern techniques",
      duration: "10 min"
    },
    {
      course: "Soup",
      description: "Signature soup with local flavors",
      duration: "15 min"
    },
    {
      course: "Fish Course",
      description: "Fresh catch with innovative preparation",
      duration: "20 min"
    },
    {
      course: "Main Course",
      description: "Premium protein with seasonal sides",
      duration: "25 min"
    },
    {
      course: "Dessert",
      description: "Artisanal dessert to complete the experience",
      duration: "15 min"
    }
  ];

  const chefProfiles = [
    {
      name: "Chef Marco Rossi",
      specialty: "Italian Cuisine",
      experience: "15 years",
      rating: 4.9,
      image: "/images/chef-marco.jpg"
    },
    {
      name: "Chef Elena Sommelier",
      specialty: "Wine Pairing",
      experience: "12 years",
      rating: 4.8,
      image: "/images/chef-elena.jpg"
    }
  ];

  const features = [
    {
      icon: ChefHat,
      title: "6-Course Menu",
      description: "Carefully crafted tasting menu"
    },
    {
      icon: Wine,
      title: "Wine Pairing",
      description: "Expertly selected wine pairings"
    },
    {
      icon: Users,
      title: "Intimate Setting",
      description: "Limited to 12 guests per seating"
    },
    {
      icon: Award,
      title: "Premium Experience",
      description: "Luxury dining at its finest"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <ImprovedNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <ChefHat className="h-16 w-16 text-amber-500 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Chef's Table
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate culinary journey with our exclusive Chef's Table. 
            A 6-course tasting menu prepared by our master chefs in an intimate setting.
          </p>
        </div>

        {/* Experience Overview */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Exclusive Dining Experience</h2>
                <p className="text-xl">Limited to 12 guests per seating</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold">2.5 Hours</h3>
                  <p className="text-sm">Full experience duration</p>
                </div>
                <div>
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold">12 Guests</h3>
                  <p className="text-sm">Maximum per seating</p>
                </div>
                <div>
                  <Utensils className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold">6 Courses</h3>
                  <p className="text-sm">Tasting menu</p>
                </div>
                <div>
                  <Wine className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold">Wine Pairing</h3>
                  <p className="text-sm">Premium selections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Course Menu */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">6-Course Tasting Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experienceDetails.map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Course {index + 1}</CardTitle>
                    <Badge variant="outline">{course.duration}</Badge>
                  </div>
                  <h3 className="font-semibold text-xl">{course.course}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{course.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Chef Profiles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Chefs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chefProfiles.map((chef, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold text-xl">{chef.name}</h3>
                      <p className="text-gray-600">{chef.specialty}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{chef.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{chef.experience} of culinary excellence</p>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-amber-100 rounded-full">
                      <feature.icon className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200">
            <CardContent className="p-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-amber-600 mb-2">1,500₽</h3>
                    <p className="text-gray-600">Per person (food only)</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-amber-600 mb-2">2,200₽</h3>
                    <p className="text-gray-600">Per person (with wine pairing)</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-amber-600 mb-2">Private</h3>
                    <p className="text-gray-600">Private table for 6-12 guests</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Booking */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Reserve Your Experience</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Limited seats available. Book your exclusive Chef's Table experience now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Calendar className="h-5 w-5 mr-2" />
              Book Now
            </Button>
            <Button size="lg" variant="outline">
              <ChefHat className="h-5 w-5 mr-2" />
              View Menu
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChefsTable;