import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Star,
  Heart,
  X,
  ThumbsUp,
  ThumbsDown,
  ChefHat,
  Store,
  Calendar,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { useToast } from '@/hooks/use-toast';

const AIRecommendations = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState(0.5);

  const {
    preferences,
    behavior,
    recommendations,
    insights,
    isLoading,
    error,
    getRecommendationsByType,
    getPersonalizedRecommendations,
    getRecommendationsByConfidence,
    rateRecommendation,
    dismissRecommendation,
    updatePreferences,
  } = useAIRecommendations();

  const { toast } = useToast();

  const handleRateRecommendation = async (id: string, rating: number) => {
    await rateRecommendation(id, rating);
    toast({
      title: 'Спасибо за оценку!',
      description: 'Ваша обратная связь поможет улучшить рекомендации',
    });
  };

  const handleDismissRecommendation = async (id: string) => {
    await dismissRecommendation(id);
    toast({
      title: 'Рекомендация скрыта',
      description: 'Мы учтем ваши предпочтения в будущих рекомендациях',
    });
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'dish':
        return <ChefHat className="h-5 w-5" />;
      case 'vendor':
        return <Store className="h-5 w-5" />;
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'experience':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Высокая';
    if (confidence >= 0.6) return 'Средняя';
    return 'Низкая';
  };

  const filteredRecommendations = recommendations.filter((rec) => {
    if (selectedTab !== 'all' && rec.type !== selectedTab) return false;
    if (rec.confidence < filterConfidence) return false;
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              Анализируем ваши предпочтения...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Brain className="h-8 w-8 mx-auto text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          🤖 AI Рекомендации
        </h1>
        <p className="text-muted-foreground">
          Персонализированные рекомендации на основе ваших предпочтений и
          поведения
        </p>
      </div>

      {/* User Profile Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Ваш профиль
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Тип личности</p>
                <p className="font-medium">
                  {insights.userProfile.foodPersonality}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Риск</p>
                <p className="font-medium">
                  {insights.userProfile.riskTaker
                    ? 'Любитель риска'
                    : 'Консерватор'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Социальность</p>
                <p className="font-medium">
                  {insights.userProfile.socialDiner
                    ? 'Социальный'
                    : 'Индивидуальный'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Здоровье</p>
                <p className="font-medium">
                  {insights.userProfile.healthConscious
                    ? 'Сознательный'
                    : 'Расслабленный'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trends */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Тренды и возможности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Популярно рядом с вами</h4>
                <div className="space-y-1">
                  {insights.trends.popularNearYou.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Трендовые кухни</h4>
                <div className="space-y-1">
                  {insights.trends.trendingCuisines.map((cuisine, index) => (
                    <Badge key={index} variant="outline">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Сезонные рекомендации</h4>
                <div className="space-y-1">
                  {insights.trends.seasonalRecommendations.map((rec, index) => (
                    <Badge key={index} variant="outline">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm">Уверенность:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filterConfidence}
                onChange={(e) =>
                  setFilterConfidence(parseFloat(e.target.value))
                }
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                {Math.round(filterConfidence * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="dish">Блюда</TabsTrigger>
          <TabsTrigger value="vendor">Вендоры</TabsTrigger>
          <TabsTrigger value="event">События</TabsTrigger>
          <TabsTrigger value="experience">Опыт</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Нет рекомендаций по выбранным фильтрам
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getRecommendationIcon(recommendation.type)}
                        <CardTitle className="text-lg">
                          {recommendation.title}
                        </CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDismissRecommendation(recommendation.id)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {recommendation.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Уверенность:
                        </span>
                        <Badge
                          className={getConfidenceColor(
                            recommendation.confidence
                          )}
                        >
                          {getConfidenceText(recommendation.confidence)}
                        </Badge>
                      </div>

                      <div className="text-sm">
                        <p className="font-medium">Почему рекомендовано:</p>
                        <p className="text-muted-foreground">
                          {recommendation.reason}
                        </p>
                      </div>
                    </div>

                    {recommendation.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Цена:</span>
                        <span className="font-medium">
                          {recommendation.price} ₽
                        </span>
                      </div>
                    )}

                    {recommendation.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {recommendation.rating}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {recommendation.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleRateRecommendation(recommendation.id, 5)
                        }
                        className="flex-1"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Нравится
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleRateRecommendation(recommendation.id, 1)
                        }
                        className="flex-1"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Не нравится
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика рекомендаций</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {recommendations.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Всего рекомендаций
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {getPersonalizedRecommendations().length}
              </p>
              <p className="text-sm text-muted-foreground">
                Персонализированных
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">
                {getRecommendationsByConfidence(0.8).length}
              </p>
              <p className="text-sm text-muted-foreground">
                Высокой уверенности
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">
                {Math.round(
                  (recommendations.reduce(
                    (acc, rec) => acc + rec.confidence,
                    0
                  ) /
                    recommendations.length) *
                    100
                )}
                %
              </p>
              <p className="text-sm text-muted-foreground">
                Средняя уверенность
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendations;
