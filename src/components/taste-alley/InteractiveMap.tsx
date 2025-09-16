
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Compass, Trophy, Clock } from "lucide-react";

interface MapSector {
  id: string;
  name: string;
  position: { x: number; y: number };
  status: 'completed' | 'active' | 'unlocked' | 'locked';
  emoji: string;
}

interface InteractiveMapProps {
  sectors: MapSector[];
  onSectorClick: (sectorId: string) => void;
}

const InteractiveMap = ({ sectors, onSectorClick }: InteractiveMapProps) => {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  const getSectorStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white shadow-emerald-300';
      case 'active':
        return 'bg-amber-500 text-white shadow-amber-300 animate-pulse';
      case 'unlocked':
        return 'bg-blue-500 text-white shadow-blue-300';
      default:
        return 'bg-gray-300 text-gray-500 shadow-gray-200';
    }
  };

  const getConnectionStyles = (fromStatus: string, toStatus: string) => {
    if (fromStatus === 'completed' && toStatus === 'completed') {
      return 'stroke-emerald-500 stroke-2';
    }
    if (fromStatus === 'completed' && toStatus === 'active') {
      return 'stroke-amber-500 stroke-2 animate-pulse';
    }
    if (fromStatus === 'completed' && toStatus === 'unlocked') {
      return 'stroke-blue-500 stroke-2';
    }
    return 'stroke-gray-300 stroke-1';
  };

  const renderConnections = () => {
    const connections = [];
    for (let i = 0; i < sectors.length - 1; i++) {
      const current = sectors[i];
      const next = sectors[i + 1];
      
      connections.push(
        <line
          key={`connection-${i}`}
          x1={current.position.x}
          y1={current.position.y}
          x2={next.position.x}
          y2={next.position.y}
          className={getConnectionStyles(current.status, next.status)}
        />
      );
    }
    return connections;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Compass className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold">Interactive Quest Map</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Navigate your journey through the Taste Alley
          </p>
        </div>

        {/* Interactive Map */}
        <div className="relative bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
          <svg 
            viewBox="0 0 400 200" 
            className="w-full h-64"
            style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
          >
            {/* Background Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Path Connections */}
            {renderConnections()}
            
            {/* Sector Points */}
            {sectors.map((sector, index) => (
              <g key={sector.id}>
                {/* Sector Circle */}
                <circle
                  cx={sector.position.x}
                  cy={sector.position.y}
                  r={hoveredSector === sector.id ? "20" : "16"}
                  className={`cursor-pointer transition-all duration-300 ${getSectorStyles(sector.status)}`}
                  onClick={() => sector.status !== 'locked' && onSectorClick(sector.id)}
                  onMouseEnter={() => setHoveredSector(sector.id)}
                  onMouseLeave={() => setHoveredSector(null)}
                />
                
                {/* Sector Emoji */}
                <text
                  x={sector.position.x}
                  y={sector.position.y + 5}
                  textAnchor="middle"
                  fontSize="16"
                  className="pointer-events-none"
                >
                  {sector.emoji}
                </text>
                
                {/* Sector Label */}
                <text
                  x={sector.position.x}
                  y={sector.position.y + 35}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-slate-600 font-medium pointer-events-none"
                >
                  {sector.name}
                </text>
                
                {/* Hover Info */}
                {hoveredSector === sector.id && (
                  <g>
                    <rect
                      x={sector.position.x - 40}
                      y={sector.position.y - 50}
                      width="80"
                      height="20"
                      rx="4"
                      className="fill-slate-800 opacity-90"
                    />
                    <text
                      x={sector.position.x}
                      y={sector.position.y - 37}
                      textAnchor="middle"
                      fontSize="10"
                      className="fill-white font-medium"
                    >
                      {sector.status === 'locked' ? 'Locked' : 'Click to explore'}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Map Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-emerald-300"></div>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full shadow-amber-300 animate-pulse"></div>
            <span className="text-sm">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-blue-300"></div>
            <span className="text-sm">Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full shadow-gray-200"></div>
            <span className="text-sm">Locked</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-2 justify-center">
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            Show Directions
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Estimated Time
          </Button>
          <Button variant="outline" size="sm">
            <Trophy className="h-4 w-4 mr-2" />
            View Rewards
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
