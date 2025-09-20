import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Lock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import ParticleEffect from './ParticleEffect';

interface AnimatedSectorCardProps {
  id: string;
  title: string;
  emoji: string;
  description: string;
  experiences: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

const AnimatedSectorCard = ({
  id,
  title,
  emoji,
  description,
  experiences,
  isUnlocked,
  isCompleted,
  isActive,
  onClick,
}: AnimatedSectorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCardStyles = () => {
    if (isCompleted) {
      return 'bg-gradient-to-br from-forest-green/10 to-sage-blue/10 border-forest-green/30 shadow-soft';
    }
    if (isActive) {
      return 'bg-gradient-to-br from-gold-light to-terracotta/10 border-gold-accent/30 shadow-glow';
    }
    if (isUnlocked) {
      return 'bg-gradient-to-br from-sage-blue/10 to-dusty-rose/10 border-sage-blue/30 shadow-soft';
    }
    return 'bg-gradient-to-br from-cream-light to-cream-medium border-charcoal/20 opacity-60';
  };

  const getButtonStyles = () => {
    if (isCompleted)
      return 'bg-forest-green hover:bg-forest-green/80 text-white';
    if (isActive) return 'bg-gold-accent hover:bg-gold-dark text-white';
    if (isUnlocked) return 'bg-sage-blue hover:bg-teal-dark text-white';
    return 'bg-charcoal/40 cursor-not-allowed text-charcoal/60';
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 transform-gpu ${getCardStyles()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Particle Effect for Completed */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <ParticleEffect isActive={isHovered} particleCount={15} />
        </div>
      )}

      {/* Animated Background Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ${
          isHovered
            ? 'opacity-100 translate-x-full'
            : 'opacity-0 -translate-x-full'
        }`}
      />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`text-4xl transition-all duration-300 ${
                isHovered ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
              }`}
            >
              {emoji}
            </div>
            <div>
              <CardTitle className="text-lg transition-colors duration-300">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {isCompleted && (
                  <Badge
                    variant="success"
                    className="bg-forest-green text-white animate-pulse"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {isActive && (
                  <Badge
                    variant="warning"
                    className="bg-gold-accent text-white animate-pulse"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
                {!isUnlocked && (
                  <Badge
                    variant="outline"
                    className="text-charcoal/60 border-charcoal/30"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Floating Sparkles for Completed */}
          {isCompleted && (
            <div className="absolute top-2 right-2 animate-bounce">
              <Sparkles className="h-5 w-5 text-forest-green" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <p className="text-sm text-muted-foreground leading-relaxed transition-all duration-300">
          {description}
        </p>

        {/* Experiences List with Staggered Animation */}
        <div className="space-y-2">
          <h5 className="text-sm font-semibold text-foreground">
            Experiences:
          </h5>
          <div className="grid grid-cols-1 gap-1">
            {experiences.map((experience, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-xs p-2 rounded-md transition-all duration-500 ${
                  isHovered
                    ? 'transform translate-x-2'
                    : 'transform translate-x-0'
                } ${
                  isCompleted
                    ? 'bg-forest-green/10 text-forest-green'
                    : isActive
                      ? 'bg-gold-light text-gold-dark'
                      : isUnlocked
                        ? 'bg-sage-blue/10 text-sage-blue'
                        : 'bg-cream-medium text-charcoal/60'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-forest-green'
                      : isActive
                        ? 'bg-gold-accent'
                        : isUnlocked
                          ? 'bg-sage-blue'
                          : 'bg-charcoal/40'
                  } ${isHovered ? 'scale-125' : 'scale-100'}`}
                />
                <span className="transition-all duration-300">
                  {experience}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button with Enhanced Animation */}
        <div className="pt-2">
          <Button
            className={`w-full transition-all duration-500 transform-gpu ${
              isHovered ? 'scale-105 shadow-lg' : 'scale-100'
            } ${getButtonStyles()}`}
            disabled={!isUnlocked}
            onClick={isUnlocked ? onClick : undefined}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 transition-transform duration-300" />
                Review Experience
              </>
            ) : isActive ? (
              <>
                <Play className="h-4 w-4 mr-2 animate-pulse" />
                Continue Quest
              </>
            ) : isUnlocked ? (
              <>
                <ArrowRight
                  className={`h-4 w-4 mr-2 transition-transform duration-300 ${
                    isHovered ? 'translate-x-1' : 'translate-x-0'
                  }`}
                />
                Start Experience
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Complete Previous Steps
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {/* Hover Glow Effect */}
      {isHovered && isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/30 rounded-lg pointer-events-none transition-opacity duration-300" />
      )}
    </Card>
  );
};

export default AnimatedSectorCard;
