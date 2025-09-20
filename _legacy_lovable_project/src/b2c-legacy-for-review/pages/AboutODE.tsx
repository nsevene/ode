import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, Heart, Globe, Tractor } from 'lucide-react';

const AboutODE = () => {
  const timelineEvents = [
    {
      year: '2023',
      title: 'The Vision Born',
      description:
        'Founded with a mission to celebrate authentic, sustainable cuisine in the heart of Ubud.',
    },
    {
      year: '2024',
      title: 'Community Building',
      description:
        'Partnered with 50+ local farmers and artisans to create a truly sustainable food ecosystem.',
    },
    {
      year: '2025',
      title: 'Grand Opening',
      description:
        'Opening our doors to welcome food lovers from around the world to experience ODE.',
    },
  ];

  const teamMembers = [
    {
      name: 'Kadek Sumarta',
      role: 'Head Chef & Co-Founder',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face',
    },
    {
      name: 'Maria Santos',
      role: 'Sustainability Director',
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b612b120?w=300&h=300&fit=crop&face',
    },
    {
      name: 'James Wilson',
      role: 'Experience Designer',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&face',
    },
    {
      name: 'Sari Dewi',
      role: 'Community Manager',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&face',
    },
  ];

  const sustainabilityStats = [
    {
      icon: Leaf,
      number: '70%',
      label: 'Local Ingredients',
      color: 'text-sage',
    },
    {
      icon: Users,
      number: '150+',
      label: 'Local Partners',
      color: 'text-forest',
    },
    {
      icon: Heart,
      number: 'Zero',
      label: 'Food Waste Goal',
      color: 'text-terracotta',
    },
    {
      icon: Globe,
      number: '100%',
      label: 'Renewable Energy',
      color: 'text-golden',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/10 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-forest mb-6">
            About ODE
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A celebration of authentic flavors, sustainable practices, and the
            vibrant community that makes Ubud a culinary destination like no
            other.
          </p>
        </div>

        {/* Story Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-forest mb-12">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-8 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{event.year}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-forest mb-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-forest mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="border-sage/30 text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-forest text-lg">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sustainability */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-forest mb-4">
              Sustainability at Heart
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in nourishing both people and planet through
              responsible sourcing, waste reduction, and community support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sustainabilityStats.map((stat, index) => (
              <Card
                key={index}
                className="border-sage/30 text-center hover:border-sage transition-colors"
              >
                <CardContent className="p-8">
                  <stat.icon
                    className={`h-12 w-12 mx-auto mb-4 ${stat.color}`}
                  />
                  <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Infographic Section */}
        <Card className="bg-gradient-to-r from-forest to-sage text-white mb-16">
          <CardContent className="p-12 text-center">
            <h3 className="text-4xl font-bold mb-4">70%</h3>
            <p className="text-xl mb-6">
              of our ingredients come from local Balinese farmers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-2xl font-bold text-golden">50+</div>
                <p className="text-sm opacity-90">Local Suppliers</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-golden">15km</div>
                <p className="text-sm opacity-90">Average Distance</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-golden">24h</div>
                <p className="text-sm opacity-90">Farm to Table</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-golden/20 to-terracotta/20 border-golden/30">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-forest mb-4">
              Join Our Community
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be part of a movement that celebrates authentic flavors while
              supporting local communities and sustainable practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-sage hover:bg-sage/90">
                Visit Us Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-forest text-forest hover:bg-forest hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutODE;
