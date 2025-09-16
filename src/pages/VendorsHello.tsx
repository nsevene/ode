import React, { useState } from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, DollarSign, Users, Zap, Calculator, MapPin, FileText, Phone, MessageCircle, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function VendorsHello() {
  const isMobile = useIsMobile();
  const [selectedSpace, setSelectedSpace] = useState('corner-15');
  const [duration, setDuration] = useState(12);
  const [additionalServices, setAdditionalServices] = useState([]);

  const spaceTypes = [
    { 
      id: 'corner-15', 
      name: 'Corner Space 15m²', 
      basePrice: 2500, 
      size: 15,
      location: 'Ground Floor',
      features: ['Prime corner location', 'Equipment included', 'Storage space', 'Marketing support']
    },
    { 
      id: 'corner-25', 
      name: 'Premium Corner 25m²', 
      basePrice: 4000, 
      size: 25,
      location: 'Ground Floor - Premium',
      features: ['Premium corner location', 'Full equipment package', 'Extended storage', 'Full marketing package', 'VIP entrance access']
    },
    { 
      id: 'popup', 
      name: 'Pop-Up Space', 
      basePrice: 150, 
      size: 10,
      location: 'Flexible',
      features: ['Flexible booking', 'Basic equipment', 'Event promotion', 'Daily setup']
    }
  ];

  const additionalServicesList = [
    { id: 'marketing', name: 'Enhanced Marketing Package', price: 500 },
    { id: 'equipment', name: 'Premium Equipment Upgrade', price: 800 },
    { id: 'storage', name: 'Additional Storage', price: 300 },
    { id: 'training', name: 'Staff Training Program', price: 200 }
  ];

  const currentSpace = spaceTypes.find(s => s.id === selectedSpace);
  const baseTotal = currentSpace ? currentSpace.basePrice * duration : 0;
  const servicesTotal = additionalServices.reduce((sum, serviceId) => {
    const service = additionalServicesList.find(s => s.id === serviceId);
    return sum + (service ? service.price : 0);
  }, 0);
  const totalCost = baseTotal + servicesTotal;

  const handleServiceToggle = (serviceId) => {
    setAdditionalServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi! I'm interested in the ${currentSpace?.name} for ${duration} months. Total calculated: $${totalCost.toLocaleString()}`);
    window.open(`https://wa.me/6281339966699?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      <ImprovedNavigation />
      
      <main className={`${isMobile ? 'pb-20' : ''}`}>
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-burgundy-primary/10 via-pure-white to-terracotta/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-gold-accent to-terracotta text-pure-white px-6 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
              🍽️ BECOME VENDOR PROGRAM
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
              Join ODE Food Hall.{" "}
              <span className="text-burgundy-primary">Start Your Culinary Journey.</span>
            </h1>
            <p className="text-xl text-charcoal/80 max-w-3xl mx-auto mb-8">
              Premium culinary spaces in Ubud's most innovative food hall. 1000+ daily visitors, full marketing support, equipment included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleWhatsApp}
                size="lg" 
                className="bg-gradient-primary text-pure-white px-8 py-4 text-lg font-semibold"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Apply Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-burgundy-primary text-burgundy-primary hover:bg-burgundy-primary hover:text-pure-white"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF Deck
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Calculator & Floor Plans */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
                Calculate Your Investment
              </h2>
              <p className="text-xl text-charcoal/70">
                Interactive calculator with real-time pricing and floor plan visualization
              </p>
            </div>

            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="calculator" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculator
                </TabsTrigger>
                <TabsTrigger value="floorplan" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Floor Plans
                </TabsTrigger>
                <TabsTrigger value="application" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Apply Now
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calculator" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Calculator Controls */}
                  <Card className="border-sage-blue/20">
                    <CardHeader>
                      <CardTitle className="text-xl text-charcoal">Space & Duration Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 block">Space Type</label>
                        <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {spaceTypes.map(space => (
                              <SelectItem key={space.id} value={space.id}>
                                {space.name} - ${space.basePrice}/month
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 block">
                          Contract Duration: {duration} months
                        </label>
                        <Input 
                          type="range" 
                          min="1" 
                          max="36" 
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-charcoal/60 mt-1">
                          <span>1 month</span>
                          <span>36 months</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-charcoal mb-3 block">Additional Services</label>
                        <div className="space-y-2">
                          {additionalServicesList.map(service => (
                            <div key={service.id} className="flex items-center justify-between p-3 bg-cream-light rounded-lg">
                              <div>
                                <input 
                                  type="checkbox"
                                  id={service.id}
                                  checked={additionalServices.includes(service.id)}
                                  onChange={() => handleServiceToggle(service.id)}
                                  className="mr-3"
                                />
                                <label htmlFor={service.id} className="text-sm font-medium">{service.name}</label>
                              </div>
                              <span className="text-sm font-bold text-burgundy-primary">${service.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Calculation Results */}
                  <Card className="border-gold-accent/30 bg-gradient-light">
                    <CardHeader>
                      <CardTitle className="text-xl text-charcoal">Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentSpace && (
                        <>
                          <div className="bg-pure-white p-4 rounded-lg shadow-soft">
                            <h3 className="font-semibold text-burgundy-primary mb-2">{currentSpace.name}</h3>
                            <div className="text-sm text-charcoal/70 space-y-1">
                              <p>📍 {currentSpace.location}</p>
                              <p>📏 {currentSpace.size}m² floor space</p>
                              <p>💰 ${currentSpace.basePrice}/month base rent</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>Base rent ({duration} months)</span>
                              <span className="font-semibold">${baseTotal.toLocaleString()}</span>
                            </div>
                            {servicesTotal > 0 && (
                              <div className="flex justify-between">
                                <span>Additional services</span>
                                <span className="font-semibold">${servicesTotal.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="border-t pt-3 flex justify-between text-lg font-bold text-burgundy-primary">
                              <span>Total Investment</span>
                              <span>${totalCost.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="bg-forest-green/10 p-3 rounded-lg">
                            <p className="text-sm text-forest-green font-medium">
                              💡 Monthly break-even: ~${Math.round(totalCost / duration / 30)} per day in sales
                            </p>
                          </div>

                          <Button 
                            onClick={handleWhatsApp}
                            className="w-full bg-gradient-primary text-pure-white"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Discuss This Quote
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="floorplan" className="space-y-6">
                <div className="text-center">
                  <p className="text-charcoal/70 mb-8">Interactive floor plans showing available spaces</p>
                  <div className="bg-cream-light p-8 rounded-2xl">
                    <p className="text-charcoal/60">🏗️ Interactive floor plan visualization coming soon</p>
                    <p className="text-sm text-charcoal/50 mt-2">Contact us for detailed space layouts and 3D tours</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="application" className="space-y-6">
                <Card className="max-w-2xl mx-auto border-burgundy-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-charcoal">
                      Vendor Application Form
                    </CardTitle>
                    <p className="text-center text-charcoal/70">
                      Submit your application to join ODE Food Hall
                    </p>
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
                    <Textarea placeholder="Tell us about your culinary concept..." rows={4} />
                    <Button className="w-full bg-gradient-primary text-pure-white">
                      Submit Application
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
}