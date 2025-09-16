import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: "opening-announcement",
    title: "ODE Food Hall opens December 1, 2025",
    excerpt: "Get ready for a unique gastronomic experience in the heart of Ubud",
    content: "We are excited to announce the opening of ODE Food Hall - an innovative space...",
    author: "ODE Team",
    publishDate: "2024-11-15",
    category: "News",
    image: "/src/assets/hero-food-hall.jpg",
    seoKeywords: "ODE Food Hall opening, new restaurant Ubud, gastronomic complex Bali"
  },
  {
    id: "chefs-table-experience",
    title: "Chef's Table: Exclusive dinners with the best chefs",
    excerpt: "Learn about the Chef's Table concept and book your place",
    content: "Chef's Table at ODE Food Hall is not just dinner, it's a theatrical performance...",
    author: "Chef Andrew",
    publishDate: "2024-11-10", 
    category: "Gastronomy",
    image: "/src/assets/chefs-table.jpg",
    seoKeywords: "Chef's Table Ubud, exclusive dinner, tasting menu"
  },
  {
    id: "taste-compass-guide",
    title: "Taste Compass Guide: How to complete all 8 sectors",
    excerpt: "Complete guide to culinary journey",
    content: "Taste Compass is a unique system that allows you to explore culinary traditions...",
    author: "Maria Johnson",
    publishDate: "2024-11-05",
    category: "Guides",
    image: "/src/assets/food-overview.jpg", 
    seoKeywords: "Taste Compass guide, culinary journey, NFC passport"
  }
];

export const BlogSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Blog and News</h2>
          <p className="text-xl text-muted-foreground">
            Latest news, guides and stories from the world of ODE Food Hall
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.publishDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-primary hover:text-primary/80 flex items-center text-sm font-medium"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            All Articles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};