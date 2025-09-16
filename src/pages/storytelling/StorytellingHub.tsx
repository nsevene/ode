import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock, Star } from 'lucide-react';

const StorytellingHub: React.FC = () => {
  const { story } = useParams<{ story?: string }>();

  const stories = {
    'ode-to-origin': {
      title: 'ODE to Origin',
      description: 'Discover the authentic flavors and traditional cooking methods that define our culinary heritage.',
      content: 'Our journey begins with respect for tradition and the authentic flavors that have been passed down through generations. Each dish tells a story of its origins, connecting you to the land, the people, and the culture that created it.',
      image: '/lovable-uploads/2109f2a7-74ec-4216-b0a3-322a7bdd5ebb.png',
      highlights: ['Traditional Recipes', 'Local Ingredients', 'Cultural Heritage', 'Authentic Flavors']
    },
    'ode-to-bali': {
      title: 'ODE to Bali',
      description: 'Experience the mystical beauty and spiritual essence of Bali through our curated culinary journey.',
      content: 'Bali\'s spiritual energy flows through every aspect of our food hall. From the Hindu philosophy of Tri Hita Karana to the island\'s vibrant markets, we bring you the essence of Bali in every bite.',
      image: '/lovable-uploads/f47b0f66-7995-4b99-89ec-e05c46e92cf2.png',
      highlights: ['Balinese Spices', 'Temple Traditions', 'Island Life', 'Spiritual Connection']
    },
    'ode-to-night': {
      title: 'ODE to Night',
      description: 'As darkness falls, discover a different side of ODE with evening experiences and nightlife.',
      content: 'When the sun sets, ODE transforms into a vibrant nightlife destination. Live music, craft cocktails, and evening dining experiences create unforgettable memories under the stars.',
      image: '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
      highlights: ['Live Entertainment', 'Craft Cocktails', 'Evening Dining', 'Night Markets']
    },
    'ode-to-journey': {
      title: 'ODE to Journey',
      description: 'Every meal is a journey, every bite an adventure through flavors from around the world.',
      content: 'Your culinary journey at ODE is more than just dining—it\'s an exploration of global flavors, innovative techniques, and meaningful connections through food.',
      image: '/lovable-uploads/614f7b79-d13c-4774-9cfa-e18cf97a80ba.png',
      highlights: ['Global Cuisine', 'Flavor Exploration', 'Culinary Innovation', 'Food Stories']
    }
  };

  const currentStory = story ? stories[story as keyof typeof stories] : null;

  if (story && !currentStory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Story not found</h1>
        </div>
      </div>
    );
  }

  if (currentStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <div 
                className="h-96 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentStory.image})` }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                  <div>
                    <h1 className="text-5xl font-bold mb-4">{currentStory.title}</h1>
                    <p className="text-xl opacity-90 max-w-2xl">{currentStory.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Our Story
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {currentStory.content}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentStory.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="w-full justify-start">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-500" />
                      Experience This
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Visit our food hall to experience this story through taste, aroma, and atmosphere.
                    </p>
                    <Button className="w-full">
                      Book Experience
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main storytelling hub
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ODE Storytelling</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every flavor tells a story. Discover the narratives that shape our culinary philosophy 
            and connect you to the deeper meaning behind each dish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {Object.entries(stories).map(([slug, story]) => (
            <Card key={slug} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative overflow-hidden rounded-t-lg">
                <div 
                  className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${story.image})` }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {story.title}
                  <Badge variant="outline">Story</Badge>
                </CardTitle>
                <CardDescription>{story.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    5 min read
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = `/storytelling/${slug}`}
                  >
                    Read Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Experience Our Stories</CardTitle>
              <CardDescription>
                These stories come alive in our food hall through carefully crafted dishes, 
                ambiance, and experiences that honor their origins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full sm:w-auto">
                Visit ODE Food Hall
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StorytellingHub;