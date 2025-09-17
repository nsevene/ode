import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Building, 
  Users, 
  DollarSign,
  CheckCircle,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Calendar,
  Star
} from 'lucide-react';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const TenantsFloorPlan = () => {
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [viewMode, setViewMode] = useState('ground'); // 'ground' or 'second'
  const [zoom, setZoom] = useState(1);

  const spaces = [
    {
      id: 'corner-1',
      name: 'Corner Space 1',
      size: '15m²',
      floor: 'ground',
      x: 20,
      y: 30,
      width: 60,
      height: 40,
      price: '$2,500/month',
      status: 'available',
      features: ['Prime corner', 'High visibility', 'Equipment included']
    },
    {
      id: 'corner-2',
      name: 'Corner Space 2',
      size: '18m²',
      floor: 'ground',
      x: 200,
      y: 30,
      width: 70,
      height: 45,
      price: '$3,000/month',
      status: 'available',
      features: ['Premium corner', 'Extended storage', 'VIP access']
    },
    {
      id: 'center-1',
      name: 'Center Space 1',
      size: '12m²',
      floor: 'ground',
      x: 100,
      y: 100,
      width: 50,
      height: 35,
      price: '$2,000/month',
      status: 'reserved',
      features: ['Central location', 'High foot traffic', 'Basic equipment']
    },
    {
      id: 'second-1',
      name: 'Second Floor Space 1',
      size: '20m²',
      floor: 'second',
      x: 50,
      y: 50,
      width: 80,
      height: 50,
      price: '$3,500/month',
      status: 'available',
      features: ['Spacious area', 'Jungle views', 'Premium location']
    },
    {
      id: 'second-2',
      name: 'Second Floor Space 2',
      size: '16m²',
      floor: 'second',
      x: 200,
      y: 50,
      width: 65,
      height: 45,
      price: '$2,800/month',
      status: 'available',
      features: ['Balcony access', 'Natural light', 'Quiet area']
    }
  ];

  const filteredSpaces = spaces.filter(space => space.floor === viewMode);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'reserved': return 'bg-yellow-500';
      case 'occupied': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'reserved': return 'Reserved';
      case 'occupied': return 'Occupied';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Interactive Floor Plan
          </h1>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
            Explore available spaces and find the perfect location for your culinary concept
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'ground' ? 'default' : 'outline'}
              onClick={() => setViewMode('ground')}
            >
              <Building className="w-4 h-4 mr-2" />
              Ground Floor
            </Button>
            <Button
              variant={viewMode === 'second' ? 'default' : 'outline'}
              onClick={() => setViewMode('second')}
            >
              <Building className="w-4 h-4 mr-2" />
              Second Floor
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => setZoom(1)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Floor Plan */}
          <div className="lg:col-span-2">
            <Card>
          <CardHeader>
                <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    {viewMode === 'ground' ? 'Ground Floor' : 'Second Floor'} Layout
            </CardTitle>
                  <Badge variant="outline">
                    Zoom: {Math.round(zoom * 100)}%
                  </Badge>
                </div>
          </CardHeader>
          <CardContent>
                <div className="relative bg-gradient-light rounded-lg p-4 overflow-auto">
                  <div 
                    className="relative mx-auto"
                    style={{ 
                      width: '400px', 
                      height: '300px',
                      transform: `scale(${zoom})`,
                      transformOrigin: 'center'
                    }}
                  >
                    {/* Floor Plan Background */}
                    <div className="absolute inset-0 bg-white border-2 border-charcoal/20 rounded-lg">
                      {/* Grid lines */}
                      <div className="absolute inset-0 opacity-20">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="absolute border-l border-charcoal/10" style={{ left: `${i * 10}%` }} />
                        ))}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="absolute border-t border-charcoal/10" style={{ top: `${i * 12.5}%` }} />
                        ))}
                      </div>

                      {/* Spaces */}
                      {filteredSpaces.map((space) => (
                        <div
                          key={space.id}
                          className={`absolute cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            selectedSpace?.id === space.id ? 'ring-2 ring-primary' : ''
                          }`}
                          style={{
                            left: `${space.x}px`,
                            top: `${space.y}px`,
                            width: `${space.width}px`,
                            height: `${space.height}px`,
                          }}
                          onClick={() => setSelectedSpace(space)}
                        >
                          <div className={`w-full h-full rounded-lg border-2 border-white ${getStatusColor(space.status)} opacity-80 hover:opacity-100`}>
                            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                              {space.name}
                            </div>
                            <div className="absolute top-1 right-1">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(space.status)}`} />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Legend */}
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span>Available</span>
              </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span>Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span>Occupied</span>
                        </div>
                </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Space Details */}
          <div className="lg:col-span-1">
            {selectedSpace ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedSpace.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSpace(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
          </div>
                  <Badge className={selectedSpace.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {getStatusText(selectedSpace.status)}
                  </Badge>
      </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-charcoal/60">Size</div>
                      <div className="font-medium">{selectedSpace.size}</div>
          </div>
                    <div>
                      <div className="text-sm text-charcoal/60">Price</div>
                      <div className="font-medium text-primary">{selectedSpace.price}</div>
          </div>
        </div>
        
            <div>
                    <div className="text-sm text-charcoal/60 mb-2">Features</div>
                    <ul className="space-y-1">
                      {selectedSpace.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
            </div>

                  {selectedSpace.status === 'available' && (
                    <div className="space-y-2">
                      <Button className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book This Space
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Info className="w-4 h-4 mr-2" />
                        More Details
              </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Map className="w-12 h-12 text-charcoal/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-charcoal mb-2">Select a Space</h3>
                  <p className="text-sm text-charcoal/60">
                    Click on any space in the floor plan to view details and availability
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Available Spaces List */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Available Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredSpaces.filter(space => space.status === 'available').map((space) => (
                    <div
                      key={space.id}
                      className="flex items-center justify-between p-3 bg-gradient-light rounded-lg cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setSelectedSpace(space)}
                    >
                      <div>
                        <div className="font-medium text-sm">{space.name}</div>
                        <div className="text-xs text-charcoal/60">{space.size} • {space.price}</div>
                      </div>
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantsFloorPlan;