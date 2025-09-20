import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  User,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingStates';

interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful_count: number;
  not_helpful_count: number;
  vendor_name?: string;
  menu_item_name?: string;
  images?: string[];
  verified: boolean;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewsSectionProps {
  entityId: string;
  entityType: 'vendor' | 'menu_item' | 'event';
  entityName: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  entityId,
  entityType,
  entityName,
}) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'rating' | 'helpful'
  >('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    images: [] as string[],
  });

  useEffect(() => {
    fetchReviews();
  }, [entityId, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Здесь будет реальный API вызов
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockReviews: Review[] = [
        {
          id: '1',
          user_name: 'Анна Смирнова',
          user_avatar: 'https://example.com/avatar1.jpg',
          rating: 5,
          title: 'Отличное блюдо!',
          content:
            'Очень вкусная паста, рекомендую всем. Порция большая, цена адекватная.',
          date: '2024-01-15T10:30:00Z',
          helpful_count: 12,
          not_helpful_count: 1,
          vendor_name: 'Dolce Italia',
          menu_item_name: 'Паста Карбонара',
          verified: true,
        },
        {
          id: '2',
          user_name: 'Михаил Петров',
          user_avatar: 'https://example.com/avatar2.jpg',
          rating: 4,
          title: 'Хорошо, но можно лучше',
          content: 'Вкусно, но ждал больше специй. В целом неплохо.',
          date: '2024-01-14T15:20:00Z',
          helpful_count: 8,
          not_helpful_count: 2,
          vendor_name: 'Spicy Asia',
          menu_item_name: 'Том Ям',
          verified: false,
        },
        {
          id: '3',
          user_name: 'Елена Козлова',
          user_avatar: 'https://example.com/avatar3.jpg',
          rating: 5,
          title: 'Превосходно!',
          content:
            'Лучший суши в городе! Свежие ингредиенты, отличное качество.',
          date: '2024-01-13T12:15:00Z',
          helpful_count: 15,
          not_helpful_count: 0,
          vendor_name: 'Spicy Asia',
          menu_item_name: 'Суши сет',
          verified: true,
        },
      ];

      const mockStats: ReviewStats = {
        average_rating: 4.7,
        total_reviews: 127,
        rating_distribution: {
          5: 89,
          4: 28,
          3: 7,
          2: 2,
          1: 1,
        },
      };

      setReviews(mockReviews);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewForm.rating === 0) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, поставьте оценку',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      // Здесь будет реальный API вызов
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReview: Review = {
        id: Date.now().toString(),
        user_name: 'Вы',
        rating: reviewForm.rating,
        title: reviewForm.title,
        content: reviewForm.content,
        date: new Date().toISOString(),
        helpful_count: 0,
        not_helpful_count: 0,
        vendor_name: entityName,
        verified: true,
      };

      setReviews((prev) => [newReview, ...prev]);
      setReviewForm({ rating: 0, title: '', content: '', images: [] });
      setShowReviewForm(false);

      toast({
        title: 'Отзыв добавлен',
        description: 'Спасибо за ваш отзыв!',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить отзыв',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                helpful_count: helpful
                  ? review.helpful_count + 1
                  : review.helpful_count,
                not_helpful_count: !helpful
                  ? review.not_helpful_count + 1
                  : review.not_helpful_count,
              }
            : review
        )
      );
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFilteredReviews = () => {
    let filtered = [...reviews];

    if (filterRating) {
      filtered = filtered.filter((review) => review.rating === filterRating);
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case 'oldest':
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpful_count - a.helpful_count);
        break;
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Отзывы и оценки
            </CardTitle>
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Написать отзыв
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Review Stats */}
      {stats && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold">
                    {stats.average_rating}
                  </div>
                  <div>
                    {renderStars(Math.round(stats.average_rating))}
                    <p className="text-gray-600 mt-1">
                      {stats.total_reviews} отзывов
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Распределение оценок</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${(stats.rating_distribution[rating as keyof typeof stats.rating_distribution] / stats.total_reviews) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {
                          stats.rating_distribution[
                            rating as keyof typeof stats.rating_distribution
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Sort */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Фильтры:</span>
              <div className="flex gap-2">
                <Button
                  variant={filterRating === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRating(null)}
                >
                  Все
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filterRating === rating ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setFilterRating(filterRating === rating ? null : rating)
                    }
                  >
                    {rating}★
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="newest">Новые</option>
                <option value="oldest">Старые</option>
                <option value="rating">По оценке</option>
                <option value="helpful">Полезные</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Написать отзыв</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Оценка *
                </label>
                {renderStars(reviewForm.rating, true, (rating) =>
                  setReviewForm((prev) => ({ ...prev, rating }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Заголовок отзыва
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Краткое описание вашего опыта"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Отзыв *
                </label>
                <Textarea
                  value={reviewForm.content}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Расскажите о вашем опыте..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {submitting ? 'Отправка...' : 'Отправить отзыв'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {getFilteredReviews().map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {review.user_avatar ? (
                    <img
                      src={review.user_avatar}
                      alt={review.user_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{review.user_name}</h4>
                    {review.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Проверенный
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  <h5 className="font-medium mb-2">{review.title}</h5>
                  <p className="text-gray-700 mb-4">{review.content}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, true)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Полезно ({review.helpful_count})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, false)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Не полезно ({review.not_helpful_count})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
