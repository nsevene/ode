import FoodCornerCard from '@/components/FoodCornerCard';
import TasteCompass from '@/components/TasteCompass';
import NFCPassportDemo from '@/components/NFCPassportDemo';
import PageLayout from '@/components/layout/PageLayout';

const Home = () => {
  const foodCorners = [
    {
      name: 'Pizza Corner',
      capacity: '20-25 гостей',
      size: '17.9м²',
      description: 'Authentic Neapolitan pizza',
    },
    {
      name: 'Italy Corner',
      capacity: '18-22 гостей',
      size: '17.1м²',
      description: 'Classic Italian cuisine',
    },
    {
      name: 'Sushi Corner',
      capacity: '15-20 гостей',
      size: '16.2м²',
      description: 'Fresh Japanese sushi',
    },
    {
      name: 'Burger Corner',
      capacity: '25-30 гостей',
      size: '18.5м²',
      description: 'Gourmet burgers',
    },
    {
      name: 'Ramen Corner',
      capacity: '20-25 гостей',
      size: '17.3м²',
      description: 'Authentic Japanese ramen',
    },
    {
      name: 'Dessert Corner',
      capacity: '15-18 гостей',
      size: '15.8м²',
      description: 'Sweet delights',
    },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            ODE Food Hall — Gastro Village Ubud
          </h1>
          <p className="text-lg text-muted-foreground">
            Opening: December 1, 2025 | 1,400 m² | Ubud, Bali
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Food Corners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodCorners.map((corner, index) => (
              <FoodCornerCard key={index} {...corner} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <TasteCompass />
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            NFC Experience
          </h2>
          <NFCPassportDemo />
        </section>
      </div>
    </PageLayout>
  );
};

export default Home;
