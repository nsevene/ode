import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  MapPin,
  Users,
  Calendar,
  Wifi,
  Coffee,
  Wine,
  Sunset,
  ShoppingBag,
  Sparkles,
  FlaskConical,
  Utensils,
  Laptop,
  Waves,
} from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  emoji: string;
  schedule: string;
  description: string;
  mood: string;
  features: string[];
  vibe: string;
  position: { x: number; y: number };
  color: string;
  available: boolean;
  area?: string;
}

const SecondFloor = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const zones: Zone[] = [
    {
      id: 'taste-garden',
      name: 'Taste Garden',
      emoji: '🌿',
      schedule: 'Transforms throughout the day',
      description:
        'Lectures, shows, meetings, musical performances, dinners (17:00–19:30). The heart of the second floor where ideas come to life.',
      mood: "I'm part of something special happening here",
      features: [
        'Live performances',
        'Lecture space',
        'Musical shows',
        'Intimate dinners',
        'Transformable setup',
      ],
      vibe: 'Cultural hub that adapts to every event',
      position: { x: 45, y: 45 },
      color: 'emerald',
      available: true,
      area: '150 m²',
    },
    {
      id: 'sunset-terrace',
      name: 'Sunset Terrace',
      emoji: '🌇',
      schedule: 'Evening relaxation zone',
      description:
        'The most relaxed zone. Evening, silence, mountains, sunset, wine — pure magic. Where time slows down and moments become memories.',
      mood: "I'm completely at peace, watching the world slow down",
      features: [
        'Mountain views',
        'Sunset views',
        'Wine selection',
        'Peaceful atmosphere',
        'Comfortable seating',
      ],
      vibe: 'Magical evening retreat with mountain sunset views',
      position: { x: 75, y: 25 },
      color: 'amber',
      available: true,
      area: '100 m²',
    },
    {
      id: 'hookah-lounge',
      name: 'Hookah Lounge',
      emoji: '💨',
      schedule: 'Evening relaxation zone',
      description:
        'Evening relaxation zone with sofas, soft lighting, gentle ambient sounds. A place to unwind and connect.',
      mood: "I'm relaxing with friends, enjoying the calm vibe",
      features: [
        'Comfortable sofas',
        'Soft ambient lighting',
        'Hookah service',
        'Relaxed atmosphere',
        'Social seating',
      ],
      vibe: 'Cozy evening lounge with soft lighting and comfortable seating',
      position: { x: 25, y: 65 },
      color: 'violet',
      available: true,
      area: '90 m²',
    },
    {
      id: 'coworking-zone',
      name: 'Air-conditioned Coworking',
      emoji: '🧑‍💻',
      schedule: 'Daily workspace',
      description:
        'Comfortable workspace. Silence, power outlets, fresh air conditioning. Perfect for focused work or quiet meetings.',
      mood: "I'm productive and comfortable, everything I need is here",
      features: [
        'Air conditioning',
        'Power outlets',
        'Quiet environment',
        'WiFi',
        'Ergonomic seating',
      ],
      vibe: 'Professional workspace with perfect climate control',
      position: { x: 70, y: 75 },
      color: 'blue',
      available: true,
      area: '80 m²',
    },
    {
      id: 'wine-staircase',
      name: 'Wine Staircase',
      emoji: '🍷',
      schedule: 'Entrance experience',
      description:
        'The emotional entrance to the second floor that leads directly to the tasting zone. Creates the first impression and sets the wine mood.',
      mood: "I'm ascending into a world of wine discovery",
      features: [
        'Wine display',
        'Tasting area',
        'Architectural feature',
        'Emotional entrance',
        'Wine education',
      ],
      vibe: 'Wine gallery integrated into architecture, creating emotional arrival',
      position: { x: 15, y: 35 },
      color: 'burgundy',
      available: true,
      area: '20 m²',
    },
  ];

  const getZoneColorClasses = (
    color: string,
    isSelected: boolean,
    isHovered: boolean
  ) => {
    const colorMap = {
      emerald: {
        bg: isSelected || isHovered ? 'bg-emerald-500' : 'bg-emerald-400',
        border: 'border-emerald-300',
        text: 'text-emerald-800',
      },
      amber: {
        bg: isSelected || isHovered ? 'bg-amber-500' : 'bg-amber-400',
        border: 'border-amber-300',
        text: 'text-amber-800',
      },
      blue: {
        bg: isSelected || isHovered ? 'bg-blue-500' : 'bg-blue-400',
        border: 'border-blue-300',
        text: 'text-blue-800',
      },
      burgundy: {
        bg: isSelected || isHovered ? 'bg-red-600' : 'bg-red-500',
        border: 'border-red-300',
        text: 'text-red-800',
      },
      violet: {
        bg: isSelected || isHovered ? 'bg-violet-500' : 'bg-violet-400',
        border: 'border-violet-300',
        text: 'text-violet-800',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getScheduleIcon = (schedule: string) => {
    if (schedule.includes('Evening')) return <Sunset className="w-4 h-4" />;
    if (schedule.includes('Daily')) return <Clock className="w-4 h-4" />;
    if (schedule.includes('workspace')) return <Laptop className="w-4 h-4" />;
    if (schedule.includes('Entrance')) return <Wine className="w-4 h-4" />;
    if (schedule.includes('Transforms'))
      return <Sparkles className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Second Floor | ODE Food Hall Ubud — Atmospheric Zones</title>
        <meta
          name="description"
          content="Explore the atmospheric zones of ODE's second floor: Taste Garden, Sunset Terrace, Hookah Lounge, Coworking Zone, Wine Staircase. 700 m² of transformable space."
        />
      </Helmet>

      <ImprovedNavigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="text-6xl animate-pulse">🏢</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent">
                Second Floor
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              700 m² of transformable space. Every hour — its own vibe. Every
              zone — its own mood.
            </p>
            <div className="text-lg text-muted-foreground">
              <div className="mb-2">
                🌿 Taste Garden (150 m²) | 🌇 Sunset Terrace (100 m²)
              </div>
              <div className="mb-2">
                💨 Hookah Lounge (90 m²) | 🧑‍💻 Coworking Zone (80 m²)
              </div>
              <div>🍷 Wine Staircase (20 m²)</div>
            </div>
            <div className="text-lg text-muted-foreground italic mt-4">
              "This space doesn't overwhelm. It listens."
            </div>
          </div>

          {/* Interactive Floor Map */}
          <div className="relative bg-card border border-border rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Interactive Zone Map
            </h2>

            <div className="relative w-full h-96 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden">
              {/* Floor Plan Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
              </div>

              {/* Zone Markers */}
              {zones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id;
                const isHovered = hoveredZone === zone.id;
                const colorClasses = getZoneColorClasses(
                  zone.color,
                  isSelected,
                  isHovered
                );

                return (
                  <div
                    key={zone.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'scale-125 z-20'
                        : isHovered
                          ? 'scale-110 z-10'
                          : 'z-0'
                    }`}
                    style={{
                      left: `${zone.position.x}%`,
                      top: `${zone.position.y}%`,
                    }}
                    onClick={() => setSelectedZone(zone)}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${colorClasses.bg} ${colorClasses.border} border-2 flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-xl">{zone.emoji}</span>
                    </div>

                    {!zone.available && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white"></div>
                    )}

                    <div
                      className={`absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium px-2 py-1 rounded ${colorClasses.bg} ${colorClasses.text} opacity-0 transition-opacity duration-200 ${
                        isHovered || isSelected ? 'opacity-100' : ''
                      }`}
                    >
                      {zone.name}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Click on a zone for detailed information
            </p>
          </div>

          {/* Selected Zone Details */}
          {selectedZone && (
            <Card className="mb-16 animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{selectedZone.emoji}</span>
                    <div>
                      <h3 className="text-2xl">{selectedZone.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getScheduleIcon(selectedZone.schedule)}
                        <span className="text-sm text-muted-foreground">
                          {selectedZone.schedule}
                        </span>
                        {selectedZone.area && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedZone.area}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        selectedZone.available ? 'default' : 'destructive'
                      }
                    >
                      {selectedZone.available ? 'Available' : 'Closed'}
                    </Badge>
                    {selectedZone.available && <Button>Book Now</Button>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Atmosphere</h4>
                  <p className="text-muted-foreground italic">
                    "{selectedZone.description}"
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Mood</h4>
                  <p className="text-muted-foreground">"{selectedZone.mood}"</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Vibe</h4>
                  <p className="text-muted-foreground">{selectedZone.vibe}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedZone.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zones Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => {
              const colorClasses = getZoneColorClasses(
                zone.color,
                false,
                false
              );

              return (
                <Card
                  key={zone.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedZone?.id === zone.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedZone(zone)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${colorClasses.bg.replace('bg-', 'bg-').replace(/\d+/, '100')}`}
                      >
                        <span className="text-2xl">{zone.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getScheduleIcon(zone.schedule)}
                          <span className="text-sm text-muted-foreground">
                            {zone.schedule}
                          </span>
                        </div>
                        {zone.area && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {zone.area}
                          </Badge>
                        )}
                      </div>
                      <Badge
                        variant={zone.available ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {zone.available ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {zone.description}
                    </p>
                    <div className="text-xs text-muted-foreground italic">
                      "{zone.mood}"
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">700</div>
                <div className="text-sm text-muted-foreground">
                  Total Area (m²)
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">200</div>
                <div className="text-sm text-muted-foreground">
                  Seating Capacity
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-sm text-muted-foreground">
                  Unique Zones
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">
                  Flexible Hours
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Experience the Second Floor?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Each zone offers a unique atmosphere designed for different
                  moments of your day. From productive work sessions to magical
                  sunset views.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Book a Zone
                  </Button>
                  <Button size="lg" variant="outline">
                    View Schedule
                  </Button>
                  <Button size="lg" variant="ghost">
                    Take Virtual Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecondFloor;
