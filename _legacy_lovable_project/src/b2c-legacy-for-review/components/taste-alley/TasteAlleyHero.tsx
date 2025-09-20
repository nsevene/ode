import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

interface TasteAlleyHeroProps {
  onStartQuest: () => void;
}

const TasteAlleyHero = ({ onStartQuest }: TasteAlleyHeroProps) => {
  return (
    <div className="mb-16">
      {/* Separate Image Section */}
      <div className="h-[50vh] overflow-hidden rounded-2xl mb-8">
        <img
          src="/lovable-uploads/614f7b79-d13c-4774-9cfa-e18cf97a80ba.png"
          alt="Taste Alley atmosphere"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Separate Text Content Section */}
      <div className="text-center px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="mb-6 bg-gradient-primary text-pure-white border-0 animate-fade-in"
          >
            Interactive Experience • NFC Passport • AR Journey
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-charcoal animate-slide-up">
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-gold-accent via-terracotta to-burgundy-primary bg-clip-text text-transparent">
              Taste Alley
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-charcoal/80 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in">
            Embark on an immersive 51-meter journey through the world's most
            iconic flavors. Four mystical sectors await:{' '}
            <span className="text-gold-accent font-semibold">Umami</span>,
            <span className="text-terracotta font-semibold"> Smoke</span>,
            <span className="text-dusty-rose font-semibold"> Spice</span>, and
            <span className="text-forest-green font-semibold"> Ferment</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button
              size="lg"
              onClick={onStartQuest}
              className="bg-gradient-primary text-pure-white hover:shadow-glow border-2 border-transparent hover:border-gold-accent/30 px-8 py-4 text-lg group"
            >
              <MapPin className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Start Your Quest
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-charcoal/30 text-charcoal hover:bg-charcoal/10 px-8 py-4 text-lg"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Private Experience
            </Button>
          </div>

          {/* Floating Sector Indicators */}
          <div className="flex justify-center gap-6 mt-12 animate-fade-in">
            {[
              { name: 'Umami', color: 'from-purple-500 to-purple-600' },
              { name: 'Smoke', color: 'from-purple-600 to-indigo-600' },
              { name: 'Spice', color: 'from-red-500 to-orange-500' },
              { name: 'Ferment', color: 'from-green-500 to-emerald-600' },
            ].map((sector, index) => (
              <div
                key={sector.name}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${sector.color} text-pure-white text-sm font-semibold shadow-lg animate-pulse`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {sector.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasteAlleyHero;
