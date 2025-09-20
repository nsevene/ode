import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Grid3X3,
  MoreHorizontal,
  Heart,
  Share2,
  Download,
  ZoomIn,
  Play,
  Pause,
  RotateCw,
  X,
  Eye,
  Calendar,
  MapPin,
  Camera,
  Tag,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  tags: string[];
  date?: string;
  photographer?: string;
  location?: string;
  description?: string;
  likes?: number;
  views?: number;
}

interface InteractivePhotoGalleryProps {
  images?: GalleryImage[];
  autoSlideshow?: boolean;
  slideshowInterval?: number;
}

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: '1',
    src: '/lovable-uploads/9661fa44-47b8-4375-9a53-04abf298479f.png',
    alt: 'Современная лестница и зона отдыха',
    title: 'Главный холл с лестницей',
    category: 'Интерьер',
    tags: ['лестница', 'холл', 'дизайн'],
    date: '2024-01-15',
    location: 'Главный зал',
    photographer: 'ODE Team',
    description: 'Элегантная винтовая лестница в центре фуд-холла',
    likes: 42,
    views: 156,
  },
  {
    id: '2',
    src: '/lovable-uploads/5f48e66f-a458-4c15-8b23-f6dd5510d746.png',
    alt: 'Открытая кухня и зона питания',
    title: 'Открытая кухня Italy Bakery Bar',
    category: 'Кухня',
    tags: ['кухня', 'италия', 'пекарня'],
    date: '2024-01-12',
    location: 'Italy Bakery Bar',
    photographer: 'Chef Marco',
    description:
      'Аутентичная итальянская кухня с видом на процесс приготовления',
    likes: 67,
    views: 203,
  },
  {
    id: '3',
    src: '/lovable-uploads/2109f2a7-74ec-4216-b0a3-322a7bdd5ebb.png',
    alt: 'Обеденная зона Grunge Food Hall',
    title: 'Grunge Food Hall',
    category: 'Обеденная зона',
    tags: ['грандж', 'лофт', 'атмосфера'],
    date: '2024-01-10',
    location: 'Grunge Food Hall',
    photographer: 'Style Team',
    description: 'Индустриальный стиль с элементами лофта',
    likes: 89,
    views: 324,
  },
  {
    id: '4',
    src: '/lovable-uploads/e4185a57-61aa-40bc-aa42-8d67dfc82a33.png',
    alt: 'Винная коллекция с подсветкой',
    title: 'Винный погреб',
    category: 'Вино',
    tags: ['вино', 'погреб', 'коллекция'],
    date: '2024-01-08',
    location: 'Wine Cellar',
    photographer: 'Sommelier Team',
    description: 'Эксклюзивная коллекция вин с профессиональной подсветкой',
    likes: 134,
    views: 456,
  },
  {
    id: '5',
    src: '/lovable-uploads/a31197e2-d494-49db-812f-2c7a870c67e6.png',
    alt: 'Винная лестница с коллекцией вин',
    title: 'Wine Staircase',
    category: 'Вино',
    tags: ['лестница', 'вино', 'дегустация'],
    date: '2024-01-05',
    location: 'Wine Staircase',
    photographer: 'Architecture Team',
    description: 'Уникальная винная лестница для дегустаций',
    likes: 156,
    views: 678,
  },
  {
    id: '6',
    src: '/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png',
    alt: 'Барная стойка с зелеными стульями',
    title: 'Барная зона',
    category: 'Бар',
    tags: ['бар', 'коктейли', 'атмосфера'],
    date: '2024-01-03',
    location: 'Main Bar',
    photographer: 'Bar Team',
    description: 'Стильная барная зона с авторскими коктейлями',
    likes: 78,
    views: 234,
  },
];

const CATEGORIES = [
  'Все',
  'Интерьер',
  'Кухня',
  'Обеденная зона',
  'Вино',
  'Бар',
  'События',
];

export const InteractivePhotoGallery = ({
  images = DEFAULT_IMAGES,
  autoSlideshow = false,
  slideshowInterval = 3000,
}: InteractivePhotoGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const isMobile = useIsMobile();
  const slideshowTimer = useRef<NodeJS.Timeout>();

  // Фильтрация изображений
  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      image.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Все' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Автоматическое слайд-шоу
  useEffect(() => {
    if (isSlideshow) {
      slideshowTimer.current = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % filteredImages.length);
      }, slideshowInterval);
    } else {
      if (slideshowTimer.current) {
        clearInterval(slideshowTimer.current);
      }
    }

    return () => {
      if (slideshowTimer.current) {
        clearInterval(slideshowTimer.current);
      }
    };
  }, [isSlideshow, filteredImages.length, slideshowInterval]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % filteredImages.length);
    setRotation(0);
    setZoom(1);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
    );
    setRotation(0);
    setZoom(1);
  };

  const handleLike = (imageId: string) => {
    setLikedImages((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(imageId)) {
        newLiked.delete(imageId);
        toast({
          title: 'Убрано из избранного',
          description: 'Фотография удалена из избранного',
        });
      } else {
        newLiked.add(imageId);
        toast({
          title: 'Добавлено в избранное',
          description: 'Фотография добавлена в избранное',
        });
      }
      return newLiked;
    });
  };

  const handleShare = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: image.src,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback для браузеров без поддержки Web Share API
      navigator.clipboard.writeText(image.src);
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка на изображение скопирована в буфер обмена',
      });
    }
  };

  const handleDownload = (image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `${image.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Загрузка начата',
      description: 'Изображение загружается на ваше устройство',
    });
  };

  const resetImageTransforms = () => {
    setRotation(0);
    setZoom(1);
  };

  const renderImageGrid = () => {
    const gridClasses =
      viewMode === 'masonry'
        ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

    return (
      <div className={gridClasses}>
        {filteredImages.map((image, index) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <Card className="group cursor-pointer overflow-hidden hover-scale">
                <CardContent className="p-0 relative">
                  <div
                    className={`relative ${viewMode === 'masonry' ? 'mb-4' : 'aspect-[4/3]'} overflow-hidden`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onClick={() => setSelectedImage(index)}
                    />

                    {/* Оверлей с информацией */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-sm mb-1">
                          {image.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{image.category}</Badge>
                            {image.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {image.location}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {image.likes && (
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {image.likes}
                              </span>
                            )}
                            {image.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {image.views}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Индикатор лайка */}
                    {likedImages.has(image.id) && (
                      <div className="absolute top-2 right-2">
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
              <div className="relative w-full h-full flex flex-col">
                {/* Заголовок */}
                <DialogHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-xl">
                        {filteredImages[selectedImage]?.title}
                      </DialogTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        {filteredImages[selectedImage]?.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              filteredImages[selectedImage].date!
                            ).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                        {filteredImages[selectedImage]?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {filteredImages[selectedImage].location}
                          </span>
                        )}
                        {filteredImages[selectedImage]?.photographer && (
                          <span className="flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            {filteredImages[selectedImage].photographer}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Действия с изображением */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSlideshow(!isSlideshow)}
                        title={
                          isSlideshow
                            ? 'Остановить слайд-шоу'
                            : 'Запустить слайд-шоу'
                        }
                      >
                        {isSlideshow ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRotation((prev) => prev + 90)}
                        title="Повернуть"
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setZoom((prev) => (prev === 1 ? 2 : 1))}
                        title={zoom === 1 ? 'Увеличить' : 'Уменьшить'}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleLike(filteredImages[selectedImage].id)
                        }
                        title={
                          likedImages.has(filteredImages[selectedImage].id)
                            ? 'Убрать из избранного'
                            : 'Добавить в избранное'
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${likedImages.has(filteredImages[selectedImage].id) ? 'text-red-500 fill-current' : ''}`}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleShare(filteredImages[selectedImage])
                        }
                        title="Поделиться"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDownload(filteredImages[selectedImage])
                        }
                        title="Скачать"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                {/* Основное изображение */}
                <div className="flex-1 relative overflow-hidden bg-black">
                  <img
                    src={filteredImages[selectedImage]?.src}
                    alt={filteredImages[selectedImage]?.alt}
                    className="w-full h-full object-contain transition-transform duration-300"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${zoom})`,
                      cursor: zoom > 1 ? 'grab' : 'default',
                    }}
                  />

                  {/* Навигация */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 border-white/30 hover:bg-black/40 text-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 border-white/30 hover:bg-black/40 text-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>

                  {/* Индикаторы */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {filteredImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === selectedImage ? 'bg-white' : 'bg-white/40'
                        }`}
                        onClick={() => {
                          setSelectedImage(index);
                          resetImageTransforms();
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Информация об изображении */}
                {filteredImages[selectedImage]?.description && (
                  <div className="p-4 border-t bg-background">
                    <p className="text-sm text-muted-foreground">
                      {filteredImages[selectedImage].description}
                    </p>
                    {filteredImages[selectedImage].tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        <div className="flex gap-1 flex-wrap">
                          {filteredImages[selectedImage].tags.map(
                            (tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-cream/10 to-background">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Галерея ODE Food Hall
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Интерактивная галерея с возможностью поиска, фильтрации и слайд-шоу
          </p>
        </div>

        {/* Панель управления */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Поиск */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, тегам..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Управление видом */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                title="Сетка"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>

              <Button
                variant={viewMode === 'masonry' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('masonry')}
                title="Каменная кладка"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Фильтры
              </Button>
            </div>
          </div>

          {/* Фильтры */}
          {showFilters && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Категории</h4>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Статистика */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Найдено изображений: {filteredImages.length}</span>
            <div className="flex items-center gap-4">
              <span>Всего лайков: {likedImages.size}</span>
              {isSlideshow && (
                <Badge variant="secondary">Слайд-шоу активно</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Галерея */}
        {filteredImages.length > 0 ? (
          renderImageGrid()
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
