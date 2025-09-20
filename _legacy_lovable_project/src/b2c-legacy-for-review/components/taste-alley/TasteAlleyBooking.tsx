import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Star } from 'lucide-react';
import TimeslotBooking from '@/components/TimeslotBooking';

interface TasteAlleyBookingProps {
  onBookingComplete?: (bookingData: any) => void;
}

const TasteAlleyBooking = ({ onBookingComplete }: TasteAlleyBookingProps) => {
  const [showTimeslotBooking, setShowTimeslotBooking] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    {
      id: 'quest-basic',
      name: 'Basic Quest',
      duration: '30 minutes',
      price: 150000,
      maxGuests: 2,
      description: 'Complete the 4-step Taste Quest journey',
      features: [
        'Taste Passport included',
        'Access to all 4 sectors',
        'Basic AR experiences',
        'Completion rewards',
      ],
      popular: false,
    },
    {
      id: 'quest-premium',
      name: 'Premium Quest',
      duration: '45 minutes',
      price: 250000,
      maxGuests: 4,
      description: 'Enhanced journey with exclusive experiences',
      features: [
        'Everything in Basic Quest',
        'Priority sector access',
        'Extended AR storytelling',
        'Premium completion rewards',
        'Photo session included',
      ],
      popular: true,
    },
    {
      id: 'quest-group',
      name: 'Group Adventure',
      duration: '60 minutes',
      price: 400000,
      maxGuests: 8,
      description: 'Perfect for groups and special occasions',
      features: [
        'Everything in Premium Quest',
        'Dedicated guide',
        'Group challenges',
        'Custom photo album',
        'Exclusive dining offers',
      ],
      popular: false,
    },
  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowTimeslotBooking(true);
  };

  const handleBookingComplete = (bookingData: any) => {
    console.log('Taste Alley booking completed:', bookingData);
    setShowTimeslotBooking(false);
    if (onBookingComplete) {
      onBookingComplete(bookingData);
    }
  };

  const handleBackToPackages = () => {
    setShowTimeslotBooking(false);
    setSelectedPackage(null);
  };

  if (showTimeslotBooking && selectedPackage) {
    const selectedPkg = packages.find((pkg) => pkg.id === selectedPackage);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            Book Your Taste Alley Experience
          </h3>
          <Button variant="outline" onClick={handleBackToPackages}>
            Back to Packages
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-emerald-800">
                  {selectedPkg?.name}
                </h4>
                <p className="text-sm text-emerald-600">
                  {selectedPkg?.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-700">
                  IDR {selectedPkg?.price.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600">
                  Up to {selectedPkg?.maxGuests} guests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <TimeslotBooking
          eventType="taste-alley"
          packageInfo={{
            id: selectedPkg?.id || '',
            name: selectedPkg?.name || '',
            price: selectedPkg?.price || 0,
            duration: selectedPkg?.duration || '',
            maxGuests: selectedPkg?.maxGuests || 1,
          }}
          onBookingComplete={handleBookingComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Choose Your Experience</h3>
        <p className="text-muted-foreground">
          Select the perfect Taste Alley package for your journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative transition-all duration-300 hover:shadow-lg ${
              pkg.popular
                ? 'border-emerald-300 bg-gradient-to-b from-emerald-50 to-white'
                : 'hover:border-emerald-200'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>{pkg.name}</span>
                <Badge variant="outline" className="text-xs">
                  {pkg.duration}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-700">
                  IDR {pkg.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Up to {pkg.maxGuests}
                </div>
              </div>

              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-full">
              <MapPin className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">
                Important Information
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Advance booking recommended - limited slots available</li>
                <li>
                  • Experience runs every 30 minutes during operating hours
                </li>
                <li>
                  • Suitable for ages 8+ (children must be accompanied by
                  adults)
                </li>
                <li>• Please arrive 15 minutes before your scheduled time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasteAlleyBooking;
