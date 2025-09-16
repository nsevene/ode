
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Sector {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  experiences: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
}

interface InteractiveSectorCardsProps {
  sectors: Sector[];
  onSectorClick: (sectorId: string) => void;
}

const InteractiveSectorCards = ({ sectors, onSectorClick }: InteractiveSectorCardsProps) => {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sectors.map((sector) => (
        <Card
          key={sector.id}
          className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
            sector.isCompleted
              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
              : sector.isUnlocked
              ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-emerald-300'
              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 opacity-60'
          }`}
          onMouseEnter={() => setHoveredSector(sector.id)}
          onMouseLeave={() => setHoveredSector(null)}
          onClick={() => sector.isUnlocked && onSectorClick(sector.id)}
        >
          {/* Animated Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 flex gap-2">
            {sector.isCompleted && (
              <div className="p-2 bg-emerald-500 rounded-full animate-bounce">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
            {!sector.isUnlocked && (
              <Badge variant="outline" className="bg-gray-100 text-gray-500">
                Locked
              </Badge>
            )}
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className={`text-4xl transition-transform duration-300 ${
                hoveredSector === sector.id ? 'scale-110 rotate-12' : ''
              }`}>
                {sector.emoji}
              </div>
              <div>
                <CardTitle className={`text-xl transition-colors duration-300 ${
                  sector.isCompleted ? 'text-emerald-700' : 'text-gray-700'
                }`}>
                  {sector.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{sector.description}</p>

            {/* Experiences List */}
            <div className="space-y-2">
              <h5 className="font-semibold text-sm">Experiences:</h5>
              <div className="space-y-1">
                {sector.experiences.map((experience, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-xs p-2 rounded-md transition-all duration-300 ${
                      sector.isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      sector.isCompleted ? 'bg-emerald-500' : 'bg-gray-400'
                    }`} />
                    {experience}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                variant={sector.isCompleted ? "default" : "outline"}
                size="sm"
                className="w-full group-hover:scale-105 transition-transform duration-300"
                disabled={!sector.isUnlocked}
              >
                {sector.isCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : sector.isUnlocked ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Experience
                  </>
                ) : (
                  <>
                    Complete previous steps
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>

          {/* Hover Effect Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
        </Card>
      ))}
    </div>
  );
};

export default InteractiveSectorCards;
