import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, MapPin } from 'lucide-react';

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'Bali Times',
      role: 'Food Critic',
      avatar: '/lovable-uploads/reviewer1.jpg',
      rating: 5,
      review:
        'The fermentation section is a game-changer for Balinese cuisine! ODE Food Hall has revolutionized the dining experience in Ubud.',
      location: 'Ubud, Bali',
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      role: 'Travel Blogger',
      avatar: '/lovable-uploads/reviewer2.jpg',
      rating: 5,
      review:
        'An incredible journey through taste! The NFC passport made exploring each sector so engaging. A must-visit destination.',
      location: 'Australia',
    },
    {
      id: 3,
      name: 'Chef Marco Rossi',
      role: 'Culinary Expert',
      avatar: '/lovable-uploads/reviewer3.jpg',
      rating: 5,
      review:
        'The attention to local ingredients and traditional techniques while embracing innovation is outstanding. Bravo!',
      location: 'Italy',
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      role: 'Local Food Enthusiast',
      avatar: '/lovable-uploads/reviewer4.jpg',
      rating: 5,
      review:
        "As a local, I'm proud to see Balinese traditions honored while creating something completely new. The taste compass is brilliant!",
      location: 'Bali, Indonesia',
    },
  ];

  return (
    <section
      id="reviews"
      className="py-16 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Quote className="w-4 h-4 mr-2" />
            Guest Reviews
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            What Our Guests Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover why food enthusiasts from around the world choose ODE Food
            Hall
          </p>
        </header>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="hover:shadow-lg transition-all duration-300 border-primary/10"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={review.avatar}
                      alt={`${review.name} avatar`}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random`;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{review.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {review.role}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {review.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                <div className="relative">
                  <Quote className="h-6 w-6 text-primary/20 absolute -top-2 -left-1" />
                  <p className="text-muted-foreground leading-relaxed pl-4">
                    {review.review}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-block p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
            <h3 className="text-lg font-semibold mb-2">
              Share Your Experience
            </h3>
            <p className="text-muted-foreground mb-4">
              Visited ODE Food Hall? We'd love to hear about your culinary
              journey!
            </p>
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 from 247 reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
