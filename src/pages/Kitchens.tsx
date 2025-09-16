import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { ChefHat, Coffee, Utensils, Leaf, FlameKindling, Wheat, Cookie, Fish } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';

const Kitchens = () => {
  const isMobile = useIsMobile();
  const [kitchens, setKitchens] = useState([]);
  const [filteredKitchens, setFilteredKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const iconMap = {
    Cookie, ChefHat, Coffee, Utensils, Leaf, FlameKindling, Wheat, Fish
  };

  const getIconByCategory = (category) => {
    const iconName = category?.toLowerCase();
    if (iconName?.includes('dessert') || iconName?.includes('sweet')) return Cookie;
    if (iconName?.includes('drink') || iconName?.includes('bar')) return Coffee;
    if (iconName?.includes('vegetarian') || iconName?.includes('vegan')) return Leaf;
    if (iconName?.includes('italian') || iconName?.includes('pasta')) return Wheat;
    if (iconName?.includes('fish') || iconName?.includes('seafood')) return Fish;
    if (iconName?.includes('bbq') || iconName?.includes('grill')) return FlameKindling;
    return ChefHat;
  };

  useEffect(() => {
    fetchKitchens();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredKitchens(kitchens);
    } else {
      setFilteredKitchens(kitchens.filter(kitchen => 
        kitchen.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        kitchen.cuisine_type?.toLowerCase().includes(selectedCategory.toLowerCase())
      ));
    }
  }, [kitchens, selectedCategory]);

  const fetchKitchens = async () => {
    try {
      // Используем mock данные с реальными изображениями
      const mockKitchens = [
        {
          id: 'gelato-goods',
          name: 'Gelato & Goods',
          description: 'Small-batch gelato, chocolate, coffee beans.',
          category: 'dessert',
          cuisine_type: 'Dessert',
          area: 15,
          image_url: '/lovable-uploads/d4b6f8ee-4380-40ca-90b4-f1fc4141c0ce.png',
          slug: 'gelato-goods'
        },
        {
          id: 'pizza-kitchen',
          name: 'Pizza Kitchen',
          description: 'Wood-fired Napoli pies by chef Luca.',
          category: 'italian',
          cuisine_type: 'Italian',
          area: 20,
          slug: 'pizza-kitchen'
        }
      ];
      
      setKitchens(mockKitchens);
    } catch (error) {
      console.error('Error fetching kitchens:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'bar', name: 'Bar' },
    { id: 'wine', name: 'Wine' },
    { id: 'italian', name: 'Italian' },
    { id: 'asian', name: 'Asian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'dessert', name: 'Dessert' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--bg))' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ 
      fontFamily: "'Inter', sans-serif", 
      background: 'hsl(var(--bg))', 
      color: 'hsl(var(--text))',
      lineHeight: '1.45'
    }}>
      <ImprovedNavigation />
      
      <main className={`${isMobile ? 'pb-20' : ''}`}>
        {/* Hero Section */}
        <section style={{ padding: '4rem 1rem 2.5rem', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            marginBottom: '.5rem',
            color: 'hsl(var(--brand))'
          }}>
            10 Kitchens · Craft Bars · Gelato
          </h2>
          <p style={{ 
            maxWidth: '34rem', 
            margin: '0 auto', 
            color: 'hsl(var(--muted))'
          }}>
            From Balinese fire to Neapolitan heat — explore every flavour under one roof.
          </p>
        </section>

        {/* Filter Chips */}
        <section style={{ display: 'flex', gap: '.5rem', overflowX: 'auto', padding: '0 1rem 1rem' }}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`chip ${selectedCategory === category.id ? 'active' : ''}`}
              data-filter={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '.45rem 1rem',
                fontSize: '.85rem',
                border: '1px solid #ccc',
                borderRadius: '9999px',
                background: selectedCategory === category.id ? 'hsl(var(--brand))' : '#fff',
                color: selectedCategory === category.id ? '#fff' : 'hsl(var(--text))',
                borderColor: selectedCategory === category.id ? 'hsl(var(--brand))' : '#ccc',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {category.name}
            </button>
          ))}
        </section>

        {/* Kitchen Grid */}
        <section style={{ 
          display: 'grid', 
          gap: '1rem', 
          padding: '0 1rem 4rem',
          gridTemplateColumns: window.innerWidth >= 560 ? 'repeat(2, 1fr)' : '1fr'
        }}>
          {filteredKitchens.map((kitchen) => {
            const IconComponent = getIconByCategory(kitchen.category);
            return (
              <article
                key={kitchen.id}
                className="card"
                data-type={kitchen.category?.toLowerCase() || 'general'}
                style={{
                  background: '#fff',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 10px rgba(0,0,0,.05)',
                  transition: '.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {kitchen.image_url && (
                  <img 
                    src={kitchen.image_url} 
                    alt={kitchen.name}
                    style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                    className="c-img"
                  />
                )}
                <div style={{ padding: '1rem', textAlign: 'left' }} className="c-body">
                  <h3 style={{ 
                    fontWeight: '700', 
                    fontSize: '1.1rem', 
                    margin: '0 0 .25rem', 
                    color: 'hsl(var(--brand))' 
                  }} className="c-title">
                    {kitchen.name}
                  </h3>
                  <p style={{ 
                    fontSize: '.85rem', 
                    color: 'hsl(var(--muted))', 
                    margin: '0 0 .9rem' 
                  }} className="c-desc">
                    {kitchen.description}
                  </p>
                  <Link 
                    to={`/kitchen/${kitchen.slug || kitchen.id}`}
                    style={{ 
                      fontWeight: '600', 
                      fontSize: '.85rem', 
                      color: 'hsl(var(--fireweed))', 
                      textDecoration: 'none' 
                    }}
                    className="c-cta"
                  >
                    Explore Menu →
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {filteredKitchens.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: 'hsl(var(--muted))' }}>
              No kitchens found in this category
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Kitchens;