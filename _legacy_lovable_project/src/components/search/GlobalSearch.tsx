import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ChefHat,
  Calendar,
  MapPin,
  Star,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingStates';

interface SearchResult {
  id: string;
  type: 'menu_item' | 'vendor' | 'event' | 'space';
  title: string;
  description: string;
  price?: number;
  image_url?: string;
  vendor_name?: string;
  event_date?: string;
  location?: string;
  rating?: number;
  category?: string;
}

interface SearchFilters {
  type: string[];
  priceRange: [number, number];
  rating: number;
  location: string;
}

const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    priceRange: [0, 10000],
    rating: 0,
    location: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Load popular searches (mock data)
    setPopularSearches([
      'Паста Карбонара',
      'Суши',
      'Пицца',
      'Мастер-класс',
      'Spicy Asia',
      'Dolce Italia',
    ]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setQuery(searchQuery);

      // Save to recent searches
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

      // Here would be real API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'menu_item',
          title: 'Паста Карбонара',
          description:
            'Классическая итальянская паста с беконом и сливочным соусом',
          price: 450,
          image_url: 'https://example.com/carbonara.jpg',
          vendor_name: 'Dolce Italia',
          rating: 4.8,
          category: 'Паста',
        },
        {
          id: '2',
          type: 'vendor',
          title: 'Spicy Asia',
          description:
            'Азиатская кухня с острыми блюдами и свежими ингредиентами',
          image_url: 'https://example.com/spicy-asia.jpg',
          rating: 4.6,
          category: 'Азиатская кухня',
        },
        {
          id: '3',
          type: 'event',
          title: 'Мастер-класс по суши',
          description:
            'Научитесь готовить суши и роллы от профессионального шеф-повара',
          price: 3200,
          image_url: 'https://example.com/sushi-class.jpg',
          event_date: '2024-01-25',
          location: 'ODE Food Hall, зона Spicy Asia',
          rating: 4.9,
          category: 'Мастер-класс',
        },
        {
          id: '4',
          type: 'menu_item',
          title: 'Пицца Маргарита',
          description: 'Классическая итальянская пицца с томатами и моцареллой',
          price: 380,
          image_url: 'https://example.com/margherita.jpg',
          vendor_name: 'Dolce Italia',
          rating: 4.7,
          category: 'Пицца',
        },
      ];

      setResults(mockResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      handleSearch(value);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');

    // Navigate based on result type
    switch (result.type) {
      case 'menu_item':
        navigate(
          `/vendors/${result.vendor_name?.toLowerCase().replace(' ', '-')}`
        );
        break;
      case 'vendor':
        navigate(`/vendors/${result.title.toLowerCase().replace(' ', '-')}`);
        break;
      case 'event':
        navigate(`/events/${result.id}`);
        break;
      case 'space':
        navigate(`/spaces/${result.id}`);
        break;
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'menu_item':
        return <ChefHat className="h-4 w-4" />;
      case 'vendor':
        return <MapPin className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'space':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'menu_item':
        return 'Блюдо';
      case 'vendor':
        return 'Вендор';
      case 'event':
        return 'Событие';
      case 'space':
        return 'Пространство';
      default:
        return 'Результат';
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Поиск блюд, вендоров, событий..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-10 h-12 text-lg"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Поиск...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Результаты поиска</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Фильтры
                  </Button>
                </div>

                <div className="space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      {result.image_url && (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={result.image_url}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getResultIcon(result.type)}
                          <h4 className="font-medium truncate">
                            {result.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {getResultTypeLabel(result.type)}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 truncate mb-1">
                          {result.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {result.vendor_name && (
                            <span>Вендор: {result.vendor_name}</span>
                          )}
                          {result.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{result.rating}</span>
                            </div>
                          )}
                          {result.price && (
                            <span className="font-medium text-green-600">
                              {formatPrice(result.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-gray-600">
                  Попробуйте изменить поисковый запрос
                </p>
              </div>
            ) : (
              <div className="p-4">
                <div className="space-y-4">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Недавние поиски
                      </h3>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearchClick(search)}
                            className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Популярные поиски
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
