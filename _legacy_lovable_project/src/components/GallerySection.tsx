import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const renderImages = [
    {
      src: '/lovable-uploads/9661fa44-47b8-4375-9a53-04abf298479f.png',
      alt: 'Современная лестница и зона отдыха',
      title: 'Главный холл с лестницей',
    },
    {
      src: '/lovable-uploads/5f48e66f-a458-4c15-8b23-f6dd5510d746.png',
      alt: 'Открытая кухня и зона питания',
      title: 'Открытая кухня Italy Bakery Bar',
    },
    {
      src: '/lovable-uploads/2109f2a7-74ec-4216-b0a3-322a7bdd5ebb.png',
      alt: 'Обеденная зона Grunge Food Hall',
      title: 'Grunge Food Hall',
    },
    {
      src: '/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png',
      alt: 'Барная стойка с зелеными стульями',
      title: 'Барная зона',
    },
    {
      src: '/lovable-uploads/0ca7fb09-8d00-4dd7-8021-256042b21946.png',
      alt: 'Основной зал с высокими потолками',
      title: 'Основной обеденный зал',
    },
    {
      src: '/lovable-uploads/6b12deec-e3be-4eaf-9569-9704ec9a2f6c.png',
      alt: 'Уютная зона отдыха',
      title: 'Зона отдыха',
    },
    {
      src: '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png',
      alt: 'Общий вид зала с растениями',
      title: 'Общий вид интерьера',
    },
    {
      src: '/lovable-uploads/e4185a57-61aa-40bc-aa42-8d67dfc82a33.png',
      alt: 'Винная коллекция с подсветкой',
      title: 'Винный погреб',
    },
    {
      src: '/lovable-uploads/a31197e2-d494-49db-812f-2c7a870c67e6.png',
      alt: 'Винная лестница с коллекцией вин',
      title: 'Wine Staircase',
    },
    {
      src: '/lovable-uploads/f41aad56-be6e-42c6-b101-46d8f2520a51.png',
      alt: 'Уютная зона для винной дегустации',
      title: 'Винная дегустационная зона',
    },
    {
      src: '/lovable-uploads/13571833-e717-4110-9bc4-2a3be95c84b8.png',
      alt: 'Экспозиция редких вин и керамики',
      title: 'Коллекция редких вин',
    },
  ];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % renderImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + renderImages.length) % renderImages.length
    );
  };

  return (
    <section
      id="gallery"
      className="py-20 bg-gradient-to-b from-cream/20 via-pure-white to-sage-blue/10"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Интерьер ODE Food Hall
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Современный дизайн с индустриальными элементами, бетонными
            поверхностями и живой зеленью
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {renderImages.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card className="group cursor-pointer overflow-hidden hover-scale">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold">{image.title}</h3>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <div className="relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h3 className="text-white text-xl font-semibold">
                      {image.title}
                    </h3>
                    <p className="text-white/80">{image.alt}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="burgundy"
                size="lg"
                className="hover-scale"
                onClick={() => setSelectedImage(0)}
              >
                Посмотреть слайд-шоу
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl p-0">
              <div className="relative">
                <img
                  src={renderImages[selectedImage].src}
                  alt={renderImages[selectedImage].alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-charcoal/30 border-cream-light/30 hover:bg-charcoal/50 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4 text-cream-light" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-charcoal/30 border-cream-light/30 hover:bg-charcoal/50 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4 text-cream-light" />
                </Button>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/60 to-transparent p-6">
                  <h3 className="text-cream-light text-xl font-semibold">
                    {renderImages[selectedImage].title}
                  </h3>
                  <p className="text-cream-light/80">
                    {renderImages[selectedImage].alt}
                  </p>
                  <div className="flex justify-center space-x-2 mt-4">
                    {renderImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === selectedImage
                            ? 'bg-cream-light'
                            : 'bg-cream-light/40'
                        }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
