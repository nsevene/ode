import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Star,
  MessageCircle,
  Heart,
  Share2,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Edit,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  Award,
  Camera,
  MapPin,
  Clock,
  Verified,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userVerified: boolean;
  vendorId: string;
  vendorName: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  isVendorReply: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  level: number;
  badges: string[];
  joinDate: string;
  reviewsCount: number;
  helpfulVotes: number;
}

interface Vendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewsCount: number;
  categories: string[];
  location: string;
  isVerified: boolean;
}

const CommunityHub = () => {
  const [selectedTab, setSelectedTab] = useState('reviews');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterVendor, setFilterVendor] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { toast } = useToast();

  // Mock data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Анна Петрова',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      userVerified: true,
      vendorId: 'vendor1',
      vendorName: 'Dolce Italia',
      rating: 5,
      title: 'Невероятная паста!',
      content:
        'Попробовала карбонару в Dolce Italia - это было невероятно! Паста идеально приготовлена, соус очень вкусный. Обязательно вернусь снова.',
      images: [
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      ],
      tags: ['паста', 'итальянская кухня', 'вкусно'],
      helpful: 12,
      notHelpful: 1,
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      isEdited: false,
      replies: [
        {
          id: 'reply1',
          userId: 'vendor1',
          userName: 'Dolce Italia',
          userAvatar:
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
          content: 'Спасибо за отличный отзыв! Мы рады, что вам понравилось!',
          createdAt: '2024-01-20T16:00:00Z',
          isVendorReply: true,
        },
      ],
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Михаил Иванов',
      userAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      userVerified: false,
      vendorId: 'vendor2',
      vendorName: 'Spicy Asia',
      rating: 4,
      title: 'Хорошая азиатская кухня',
      content:
        'Заказал пад тай - получилось очень вкусно! Острота в самый раз. Единственное - порция могла бы быть больше.',
      images: [],
      tags: ['азиатская кухня', 'острый', 'пад тай'],
      helpful: 8,
      notHelpful: 2,
      createdAt: '2024-01-18T12:15:00Z',
      updatedAt: '2024-01-18T12:15:00Z',
      isEdited: false,
      replies: [],
    },
  ]);

  const [users] = useState<User[]>([
    {
      id: 'user1',
      name: 'Анна Петрова',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verified: true,
      level: 5,
      badges: ['food_critic', 'early_adopter', 'helpful_reviewer'],
      joinDate: '2023-06-15',
      reviewsCount: 45,
      helpfulVotes: 234,
    },
    {
      id: 'user2',
      name: 'Михаил Иванов',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: false,
      level: 3,
      badges: ['regular_visitor'],
      joinDate: '2023-09-20',
      reviewsCount: 12,
      helpfulVotes: 67,
    },
  ]);

  const [vendors] = useState<Vendor[]>([
    {
      id: 'vendor1',
      name: 'Dolce Italia',
      logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
      rating: 4.8,
      reviewsCount: 156,
      categories: ['итальянская кухня', 'паста', 'пицца'],
      location: '1 этаж',
      isVerified: true,
    },
    {
      id: 'vendor2',
      name: 'Spicy Asia',
      logo: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=100&h=100&fit=crop',
      rating: 4.6,
      reviewsCount: 89,
      categories: ['азиатская кухня', 'острый', 'тайская кухня'],
      location: '2 этаж',
      isVerified: true,
    },
  ]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === 'all' || review.rating.toString() === filterRating;
    const matchesVendor =
      filterVendor === 'all' || review.vendorId === filterVendor;
    return matchesSearch && matchesRating && matchesVendor;
  });

  const handleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
    toast({
      title: 'Спасибо за отзыв!',
      description: 'Ваша оценка поможет другим пользователям',
    });
  };

  const handleNotHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, notHelpful: review.notHelpful + 1 }
          : review
      )
    );
  };

  const handleReply = (reviewId: string, content: string) => {
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      userId: 'current-user',
      userName: 'Вы',
      userAvatar: '',
      content,
      createdAt: new Date().toISOString(),
      isVendorReply: false,
    };

    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, replies: [...review.replies, newReply] }
          : review
      )
    );
  };

  const handleReport = (reviewId: string) => {
    toast({
      title: 'Отзыв отправлен на модерацию',
      description: 'Мы рассмотрим ваш запрос в ближайшее время',
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'bg-purple-100 text-purple-800';
    if (level >= 3) return 'bg-blue-100 text-blue-800';
    if (level >= 1) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          👥 Сообщество ODE Food Hall
        </h1>
        <p className="text-muted-foreground">
          Отзывы, рейтинги, обсуждения и рекомендации от сообщества
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {reviews.length}
              </p>
              <p className="text-sm text-muted-foreground">Отзывов</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">
                {users.length}
              </p>
              <p className="text-sm text-muted-foreground">Участников</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{vendors.length}</p>
              <p className="text-sm text-muted-foreground">Вендоров</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">
                {Math.round(
                  (reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length) *
                    10
                ) / 10}
              </p>
              <p className="text-sm text-muted-foreground">Средний рейтинг</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск отзывов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Все рейтинги</option>
                <option value="5">5 звезд</option>
                <option value="4">4 звезды</option>
                <option value="3">3 звезды</option>
                <option value="2">2 звезды</option>
                <option value="1">1 звезда</option>
              </select>
              <select
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Все вендоры</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Новые</option>
                <option value="oldest">Старые</option>
                <option value="highest">Высокий рейтинг</option>
                <option value="lowest">Низкий рейтинг</option>
                <option value="most_helpful">Полезные</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          <TabsTrigger value="users">Участники</TabsTrigger>
          <TabsTrigger value="vendors">Вендоры</TabsTrigger>
          <TabsTrigger value="discussions">Обсуждения</TabsTrigger>
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={review.userAvatar}
                        alt={review.userName}
                      />
                      <AvatarFallback>
                        {review.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.userName}</p>
                        {review.userVerified && (
                          <Verified className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {getRatingStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>

                {review.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {review.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleHelpful(review.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Полезно ({review.helpful})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNotHelpful(review.id)}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Не полезно ({review.notHelpful})
                    </Button>
                    <Button size="sm" variant="outline">
                      <Reply className="h-4 w-4 mr-1" />
                      Ответить
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Поделиться
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {review.vendorName}
                  </div>
                </div>

                {review.replies.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">
                      Ответы ({review.replies.length})
                    </h4>
                    <div className="space-y-3">
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={reply.userAvatar}
                              alt={reply.userName}
                            />
                            <AvatarFallback>
                              {reply.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">
                                {reply.userName}
                              </p>
                              {reply.isVendorReply && (
                                <Badge variant="outline" className="text-xs">
                                  Вендор
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        {user.verified && (
                          <Verified className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <Badge className={getLevelColor(user.level)}>
                        Уровень {user.level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Отзывов</p>
                      <p className="font-medium">{user.reviewsCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Полезных</p>
                      <p className="font-medium">{user.helpfulVotes}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Значки:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.badges.map((badge, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={vendor.logo} alt={vendor.name} />
                      <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{vendor.name}</p>
                        {vendor.isVerified && (
                          <Verified className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {getRatingStars(Math.round(vendor.rating))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {vendor.rating} ({vendor.reviewsCount} отзывов)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Категории:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vendor.categories.map((category, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {vendor.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Обсуждения будут доступны в следующей версии
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityHub;
