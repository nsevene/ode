
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

const ChefsTableGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const chefsTableImages = [
    {
      src: "/lovable-uploads/9661fa44-47b8-4375-9a53-04abf298479f.png",
      alt: "Chef's Table setting",
      title: "Elegant Chef's Table setting"
    },
    {
      src: "/lovable-uploads/5f48e66f-a458-4c15-8b23-f6dd5510d746.png", 
      alt: "Open kitchen",
      title: "Open kitchen - heart of Chef's Table"
    },
    {
      src: "/lovable-uploads/2109f2a7-74ec-4216-b0a3-322a7bdd5ebb.png",
      alt: "Signature dishes",
      title: "Chef's signature dishes"
    },
    {
      src: "/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png",
      alt: "Wine pairing",
      title: "Professional wine pairing"
    },
    {
      src: "/lovable-uploads/0ca7fb09-8d00-4dd7-8021-256042b21946.png",
      alt: "Evening atmosphere",
      title: "Cozy evening atmosphere"
    },
    {
      src: "/lovable-uploads/6b12deec-e3be-4eaf-9569-9704ec9a2f6c.png",
      alt: "Guest interaction",
      title: "Conversations at the grand table"
    }
  ];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % chefsTableImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + chefsTableImages.length) % chefsTableImages.length);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Camera className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Chef's Table Photo Gallery</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {chefsTableImages.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer overflow-hidden rounded-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="text-sm font-medium">{image.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <div className="relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h3 className="text-white text-xl font-semibold">{image.title}</h3>
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
                variant="outline" 
                onClick={() => setSelectedImage(0)}
              >
                <Camera className="h-4 w-4 mr-2" />
                View All Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl p-0">
              <div className="relative">
                <img
                  src={chefsTableImages[selectedImage].src}
                  alt={chefsTableImages[selectedImage].alt}
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
                    {chefsTableImages[selectedImage].title}
                  </h3>
                  <p className="text-cream-light/80">{chefsTableImages[selectedImage].alt}</p>
                  <div className="flex justify-center space-x-2 mt-4">
                    {chefsTableImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === selectedImage ? 'bg-cream-light' : 'bg-cream-light/40'
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
      </CardContent>
    </Card>
  );
};

export default ChefsTableGallery;
