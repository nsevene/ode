import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Calendar, Star, Heart } from 'lucide-react';
import TriHitaKaranaCircle from '@/components/TriHitaKaranaCircle';

const Community = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-burgundy-primary mb-6">
            Community
          </h1>

          {/* Tri Hita Karana Circle */}
          <div className="flex justify-center mb-6">
            <TriHitaKaranaCircle size={300} />
          </div>

          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto italic font-light">
            Три гармонии, вдохновляющие каждый Ode-уголок
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">2,500+</div>
            <div className="text-sm text-muted-foreground">Members</div>
          </Card>
          <Card className="p-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">450</div>
            <div className="text-sm text-muted-foreground">Discussions</div>
          </Card>
          <Card className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-muted-foreground">Events</div>
          </Card>
          <Card className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">4.9</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </Card>
        </div>

        {/* Recent Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">M</span>
              </div>
              <div>
                <div className="font-semibold">Maria K.</div>
                <div className="text-sm text-muted-foreground">2 hours ago</div>
              </div>
            </div>
            <h3 className="font-semibold mb-2">
              Amazing Taste Quest Experience!
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Just completed the Spice Sector quest and wow! The flavors were
              incredible...
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">Taste Quest</Badge>
              <Badge variant="outline">Spice Sector</Badge>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> 24
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> 8
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">A</span>
              </div>
              <div>
                <div className="font-semibold">Alex T.</div>
                <div className="text-sm text-muted-foreground">5 hours ago</div>
              </div>
            </div>
            <h3 className="font-semibold mb-2">Chef's Table Review</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Had an unforgettable evening at the Chef's Table. The 7-course
              tasting menu...
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">Chef's Table</Badge>
              <Badge variant="outline">Review</Badge>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> 18
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> 5
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">S</span>
              </div>
              <div>
                <div className="font-semibold">Sarah L.</div>
                <div className="text-sm text-muted-foreground">1 day ago</div>
              </div>
            </div>
            <h3 className="font-semibold mb-2">New Pop-Up This Weekend!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Excited for the Japanese fusion pop-up this Saturday. Who's
              joining?
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">Pop-Up</Badge>
              <Badge variant="outline">Event</Badge>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> 32
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> 12
              </span>
            </div>
          </Card>
        </div>

        {/* Join Community CTA */}
        <Card className="p-8 text-center bg-primary/5">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Share your culinary adventures, discover new flavors, and connect
            with fellow food enthusiasts
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Join Community</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Community;
