import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ODEOverview = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            ODE Food Hall — Gastro Village Ubud
          </h1>
          <p className="text-lg text-muted-foreground">
            Opening: December 1, 2025 | 1,400 m² | Ubud, Bali
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Философия ODE</h2>
          <p className="text-center text-lg mb-8 text-muted-foreground">
            "Back to Origin. Forward to Yourself." В мире искусственного, ODE возвращает то, что реально.
          </p>
          <div className="flex justify-center mb-12">
            <img 
              src="/src/assets/food-overview.jpg" 
              alt="Ode to Earth" 
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">Ode to Earth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Tri Hita Karana: гармония с природой</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">Ode to Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">GastroVillage – Roots & Routes of Taste</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">Ode to Night</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Wine & Light Staircase</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">Ode to Bali</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">70%+ местных ингредиентов</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Picks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">👨‍🍳 Chef's Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">5-course dinner with chef</p>
                <p className="font-semibold text-primary">$55 per person</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">🔥 Бестселлеры дня</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Chef's Table Experience</p>
                <p className="text-muted-foreground">Wine Tasting Premium</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">🌱 Vegan Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Plant-Based Tasting</p>
                <p className="text-muted-foreground">Vegan Cooking Class</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Taste Compass 2.0</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">🧪 FERMENT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Live cultures and fermented flavors</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">🔥 SMOKE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Ancient fire cooking traditions</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">🌶️ SPICE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Spice route exploration</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">🐟 UMAMI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Japanese-inspired flavors</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Food Corners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pizza Corner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Authentic Neapolitan pizza</p>
                <p className="text-sm text-primary">20-25 guests | 17.9m²</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Italy Corner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Classic Italian cuisine</p>
                <p className="text-sm text-primary">18-22 guests | 17.1m²</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sushi Corner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Fresh Japanese sushi</p>
                <p className="text-sm text-primary">15-20 guests | 16.2m²</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Burger Corner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Gourmet burgers</p>
                <p className="text-sm text-primary">25-30 guests | 18.5m²</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ramen Corner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Authentic Japanese ramen</p>
                <p className="text-sm text-primary">20-25 guests | 17.3m²</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dessert Corner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Sweet delights</p>
                <p className="text-sm text-primary">15-18 guests | 15.8m²</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Interactive Experience</h2>
          <Card className="text-center max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Taste Alley</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-2">51-meter journey through flavors</p>
              <p className="text-primary font-semibold">NFC Passport required</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Interior Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img 
                src="/lovable-uploads/9661fa44-47b8-4375-9a53-04abf298479f.png" 
                alt="Main Hall" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-video overflow-hidden rounded-lg">
              <img 
                src="/lovable-uploads/5f48e66f-a458-4c15-8b23-f6dd5510d746.png" 
                alt="Open Kitchen" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-video overflow-hidden rounded-lg">
              <img 
                src="/src/assets/food-hall-interior.jpg" 
                alt="Food Hall Interior" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Контакты</h2>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <address className="not-italic text-center space-y-2">
                <p className="text-lg">Jl. Monkey Forest No.15, Ubud, Bali 80571</p>
                <p>Phone: <a href="tel:+6281943286395" className="text-primary hover:underline">+62 819 43286395</a></p>
                <p>Email: <a href="mailto:selena@odefoodhall.com" className="text-primary hover:underline">selena@odefoodhall.com</a></p>
                <p>WhatsApp: <a href="https://wa.me/6281943286395" className="text-primary hover:underline">+62 819 43286395</a></p>
              </address>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
};

export default ODEOverview;