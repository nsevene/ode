import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

const CUISINE_FILTERS = [
  { id: 'asian', name: 'Asian', emoji: '🥢', count: 4 },
  { id: 'european', name: 'European', emoji: '🍽️', count: 3 },
  { id: 'mediterranean', name: 'Mediterranean', emoji: '🫒', count: 2 },
  { id: 'latin', name: 'Latin', emoji: '🌮', count: 2 },
  { id: 'fusion', name: 'Fusion', emoji: '🌟', count: 1 },
];

const DIETARY_FILTERS = [
  { id: 'halal', name: 'Halal', icon: '🌙' },
  { id: 'vegan', name: 'Vegan', icon: '🌱' },
  { id: 'vegetarian', name: 'Vegetarian', icon: '🥗' },
  { id: 'gluten-free', name: 'Gluten Free', icon: '🌾' },
  { id: 'dairy-free', name: 'Dairy Free', icon: '🥛' },
];

const PRICE_FILTERS = [
  { id: 'budget', name: 'Budget', range: '$$', min: 0, max: 1000 },
  { id: 'mid', name: 'Mid-range', range: '$$$', min: 1000, max: 2500 },
  { id: 'premium', name: 'Premium', range: '$$$$', min: 2500, max: 5000 },
];

interface CuisineFiltersProps {
  onFiltersChange?: (filters: {
    cuisines: string[];
    dietary: string[];
    priceRange: string[];
  }) => void;
}

export const CuisineFilters = ({ onFiltersChange }: CuisineFiltersProps) => {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCuisine = (cuisineId: string) => {
    const newSelection = selectedCuisines.includes(cuisineId)
      ? selectedCuisines.filter((id) => id !== cuisineId)
      : [...selectedCuisines, cuisineId];

    setSelectedCuisines(newSelection);
    onFiltersChange?.({
      cuisines: newSelection,
      dietary: selectedDietary,
      priceRange: selectedPriceRange,
    });
  };

  const toggleDietary = (dietaryId: string) => {
    const newSelection = selectedDietary.includes(dietaryId)
      ? selectedDietary.filter((id) => id !== dietaryId)
      : [...selectedDietary, dietaryId];

    setSelectedDietary(newSelection);
    onFiltersChange?.({
      cuisines: selectedCuisines,
      dietary: newSelection,
      priceRange: selectedPriceRange,
    });
  };

  const togglePriceRange = (priceId: string) => {
    const newSelection = selectedPriceRange.includes(priceId)
      ? selectedPriceRange.filter((id) => id !== priceId)
      : [...selectedPriceRange, priceId];

    setSelectedPriceRange(newSelection);
    onFiltersChange?.({
      cuisines: selectedCuisines,
      dietary: selectedDietary,
      priceRange: newSelection,
    });
  };

  const clearAllFilters = () => {
    setSelectedCuisines([]);
    setSelectedDietary([]);
    setSelectedPriceRange([]);
    onFiltersChange?.({
      cuisines: [],
      dietary: [],
      priceRange: [],
    });
  };

  const hasActiveFilters =
    selectedCuisines.length > 0 ||
    selectedDietary.length > 0 ||
    selectedPriceRange.length > 0;

  return (
    <div className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Cuisine Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {selectedCuisines.length +
                  selectedDietary.length +
                  selectedPriceRange.length}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Cuisine Types */}
            <div>
              <h4 className="text-sm font-medium mb-2">Cuisine Type</h4>
              <div className="flex flex-wrap gap-2">
                {CUISINE_FILTERS.map((cuisine) => (
                  <Badge
                    key={cuisine.id}
                    variant={
                      selectedCuisines.includes(cuisine.id)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleCuisine(cuisine.id)}
                  >
                    <span className="mr-1">{cuisine.emoji}</span>
                    {cuisine.name}
                    <span className="ml-1 text-xs opacity-75">
                      ({cuisine.count})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div>
              <h4 className="text-sm font-medium mb-2">Dietary Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {DIETARY_FILTERS.map((dietary) => (
                  <Badge
                    key={dietary.id}
                    variant={
                      selectedDietary.includes(dietary.id)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleDietary(dietary.id)}
                  >
                    <span className="mr-1">{dietary.icon}</span>
                    {dietary.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                {PRICE_FILTERS.map((price) => (
                  <Badge
                    key={price.id}
                    variant={
                      selectedPriceRange.includes(price.id)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => togglePriceRange(price.id)}
                  >
                    <span className="mr-1">{price.range}</span>
                    {price.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && !isExpanded && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCuisines.map((id) => {
              const cuisine = CUISINE_FILTERS.find((c) => c.id === id);
              return cuisine ? (
                <Badge key={id} variant="secondary" className="text-xs">
                  {cuisine.emoji} {cuisine.name}
                </Badge>
              ) : null;
            })}
            {selectedDietary.map((id) => {
              const dietary = DIETARY_FILTERS.find((d) => d.id === id);
              return dietary ? (
                <Badge key={id} variant="secondary" className="text-xs">
                  {dietary.icon} {dietary.name}
                </Badge>
              ) : null;
            })}
            {selectedPriceRange.map((id) => {
              const price = PRICE_FILTERS.find((p) => p.id === id);
              return price ? (
                <Badge key={id} variant="secondary" className="text-xs">
                  {price.range} {price.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
