import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageCircle, Share2, Plus, Trophy, Camera } from 'lucide-react';
import { useSocialFeatures } from '@/hooks/useSocialFeatures';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';

export const SocialFeed = () => {
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { posts, loading, createPost, likePost } = useSocialFeatures();

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    setIsCreatingPost(true);
    await createPost(newPostContent);
    setNewPostContent('');
    setIsCreatingPost(false);
  };

  const getAchievementBadge = (achievementId?: string) => {
    if (!achievementId) return null;
    
    return (
      <Badge variant="secondary" className="mb-2">
        <Trophy className="w-3 h-3 mr-1" />
        Достижение
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card>
        <CardContent className="pt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Поделиться достижением или опытом...
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать пост</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Расскажите о своем опыте в ODE Food Hall..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Добавить фото
                  </Button>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || isCreatingPost}
                  >
                    {isCreatingPost ? 'Публикация...' : 'Опубликовать'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.user_profile?.avatar_url} />
                    <AvatarFallback>
                      {post.user_profile?.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {post.user_profile?.display_name || 'Анонимный пользователь'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistance(new Date(post.created_at), new Date(), {
                        addSuffix: true,
                        locale: ru
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getAchievementBadge(post.achievement_id)}
                
                <p className="text-foreground leading-relaxed">
                  {post.content}
                </p>

                {post.image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt="Post image"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePost(post.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes_count}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments_count}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Share2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Пока нет постов</h3>
                <p className="text-muted-foreground">
                  Станьте первым, кто поделится своим опытом!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};