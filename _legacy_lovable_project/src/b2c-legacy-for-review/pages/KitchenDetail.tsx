import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import KitchenCartBar from '@/components/KitchenCartBar';
import { toast } from 'sonner';

const KitchenDetail = () => {
  const { slug } = useParams();
  const isMobile = useIsMobile();
  const [kitchen, setKitchen] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    if (slug) {
      fetchKitchenData();
    }
  }, [slug]);

  const fetchKitchenData = async () => {
    try {
      // Временно используем данные из меню до создания таблиц
      const mockKitchen = {
        id: 1,
        name:
          slug?.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase()) ||
          'Кухня',
        slug: slug,
        description:
          'Описание кухни будет добавлено после создания базы данных',
        category: 'General',
        cuisine_type: 'International',
        area: 18,
        capacity: 20,
        image_url: null,
      };
      setKitchen(mockKitchen);

      // Fetch menu items
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .limit(10);

      if (menuError) throw menuError;
      setMenuItems(menuData || []);
    } catch (error) {
      console.error('Error fetching kitchen data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const updateCartItem = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      });
    } else {
      setCart((prev) => ({
        ...prev,
        [itemId]: quantity,
      }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const cartCount = Object.values(cart).reduce(
    (sum: number, qty: number) => sum + qty,
    0
  );
  const cartTotal = menuItems.reduce((total: number, item: any) => {
    const quantity = cart[item.id] || 0;
    return total + (item.price_usd / 100) * quantity;
  }, 0);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'hsl(var(--bg))' }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!kitchen) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'hsl(var(--bg))' }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kitchen not found</h1>
          <Link
            to="/kitchens"
            style={{
              display: 'inline-block',
              padding: '.45rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '9999px',
              background: '#fff',
              color: 'hsl(var(--text))',
              textDecoration: 'none',
            }}
          >
            Back to Kitchens
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen page"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: 'hsl(var(--bg))',
        color: 'hsl(var(--text))',
        lineHeight: '1.45',
        paddingBottom: '86px',
      }}
    >
      <ImprovedNavigation />

      <main className="pt-20">
        {/* Header */}
        <section style={{ padding: '1rem' }}>
          <Link
            to="/kitchens"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.5rem',
              color: 'hsl(var(--muted))',
              textDecoration: 'none',
              marginBottom: '1rem',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Kitchens
          </Link>

          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              padding: '1rem 0',
              color: 'hsl(var(--brand))',
            }}
          >
            {kitchen?.name || 'Kitchen'} · Menu
          </h2>
        </section>

        {/* Menu Items */}
        <section>
          {menuItems.map((item) => (
            <article
              key={item.id}
              className="dish-card"
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                marginBottom: '1rem',
                background: '#fff',
                borderRadius: '1rem',
                boxShadow: '0 4px 10px rgba(0,0,0,.05)',
              }}
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '.75rem',
                    objectFit: 'cover',
                  }}
                  className="dish-thumb"
                />
              )}

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontWeight: '700',
                    marginBottom: '.25rem',
                  }}
                  className="d-name"
                >
                  {item.name}
                </h4>

                {item.dietary_tags && item.dietary_tags.length > 0 && (
                  <div
                    className="tags"
                    style={{
                      display: 'flex',
                      gap: '.4rem',
                      marginBottom: '.5rem',
                    }}
                  >
                    {item.dietary_tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="tag"
                        style={{
                          fontSize: '.7rem',
                          border: '1px solid #ccc',
                          borderRadius: '9999px',
                          padding: '.1rem .6rem',
                          color: 'hsl(var(--muted))',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p
                  style={{
                    fontSize: '.8rem',
                    color: 'hsl(var(--muted))',
                    marginBottom: '.75rem',
                  }}
                >
                  {item.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="price" style={{ fontWeight: '700' }}>
                    ${(item.price_usd / 100).toFixed(2)}
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '.5rem',
                    }}
                  >
                    {cart[item.id] ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '.5rem',
                        }}
                      >
                        <button
                          onClick={() =>
                            updateCartItem(item.id, cart[item.id] - 1)
                          }
                          style={{
                            background: 'hsl(var(--accent))',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '.7rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span style={{ minWidth: '20px', textAlign: 'center' }}>
                          {cart[item.id]}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItem(item.id, cart[item.id] + 1)
                          }
                          style={{
                            background: 'hsl(var(--accent))',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '.7rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-add"
                        onClick={() => addToCart(item.id)}
                        style={{
                          background: 'hsl(var(--accent))',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '9999px',
                          padding: '.4rem .9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: 'hsl(var(--muted))' }}>
                No menu items available
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Cart Bar */}
      <KitchenCartBar
        itemCount={cartCount}
        onCheckout={() => {
          console.log('Checkout clicked', cart);
          toast.success(
            `Checkout: ${cartCount} items for $${cartTotal.toFixed(2)}`
          );
        }}
      />
    </div>
  );
};

export default KitchenDetail;
