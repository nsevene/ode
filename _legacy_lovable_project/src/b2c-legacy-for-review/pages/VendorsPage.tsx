import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Clock,
  Star,
  ChefHat,
  Phone,
  Mail,
  Globe,
  Filter,
  Grid,
  List,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingStates';

const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Кухни для фильтрации
  const cuisineTypes = [
    'all',
    'italian',
    'asian',
    'mediterranean',
    'mexican',
    'indian',
    'french',
    'japanese',
    'thai',
    'vietnamese',
    'korean',
    'middle-eastern',
    'american',
    'european',
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm, selectedCuisine]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kitchens')
        .select('*')
        .eq('is_available', true);

      if (error) {
        throw new Error(error.message);
      }

      setVendors(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки вендоров');
    } finally {
      setLoading(false);
    }
  };

  const filterVendors = () => {
    let filtered = vendors;

    // Поиск по названию и описанию
    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по типу кухни
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(
        (vendor) => vendor.cuisine_type === selectedCuisine
      );
    }

    setFilteredVendors(filtered);
  };

  const getCuisineLabel = (cuisine: string) => {
    const labels: Record<string, string> = {
      italian: 'Итальянская',
      asian: 'Азиатская',
      mediterranean: 'Средиземноморская',
      mexican: 'Мексиканская',
      indian: 'Индийская',
      french: 'Французская',
      japanese: 'Японская',
      thai: 'Тайская',
      vietnamese: 'Вьетнамская',
      korean: 'Корейская',
      'middle-eastern': 'Ближневосточная',
      american: 'Американская',
      european: 'Европейская',
    };
    return labels[cuisine] || cuisine;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchVendors}>Попробовать снова</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Вендоры</h1>
              <p className="text-gray-600 mt-1">
                Исследуйте разнообразие кулинарных предложений
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Поиск вендоров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Cuisine Filter */}
            <div className="sm:w-64">
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Все кухни</option>
                {cuisineTypes.slice(1).map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {getCuisineLabel(cuisine)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Найдено {filteredVendors.length} вендоров
          </p>
        </div>

        {/* Vendors Grid/List */}
        {filteredVendors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Вендоры не найдены
              </h3>
              <p className="text-gray-600">
                Попробуйте изменить параметры поиска
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredVendors.map((vendor) => (
              <Card
                key={vendor.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/vendors/${vendor.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {vendor.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(vendor.is_active)}
                        >
                          {vendor.is_active ? 'Активен' : 'Неактивен'}
                        </Badge>
                        <Badge variant="outline">
                          {getCuisineLabel(vendor.cuisine_type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm">4.5</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {vendor.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {vendor.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    {vendor.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{vendor.location}</span>
                      </div>
                    )}

                    {vendor.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}

                    {vendor.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{vendor.email}</span>
                      </div>
                    )}

                    {vendor.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-2" />
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:underline"
                        >
                          Веб-сайт
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/vendors/${vendor.id}`);
                      }}
                    >
                      <ChefHat className="h-4 w-4 mr-2" />
                      Посмотреть меню
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
