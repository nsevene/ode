import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/hero-bg.jpg')`,
          }}
        ></div>

        {/* Content Container */}
        <div className="relative z-10 text-center">
          <div className="bg-black/70 p-10 rounded-2xl inline-block backdrop-blur-sm">
            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              ODE FOOD HALL
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Ode to Origins. Taste the Journey.
            </p>

            {/* Location Info */}
            <p className="text-lg md:text-xl mb-2">
              📍 Ubud, Bali | Opening: December 1, 2025 |{' '}
              <strong>1,800 m²</strong>
            </p>

            {/* Philosophy */}
            <p className="text-lg mb-6">
              <em>"Back to Origin. Forward to Yourself."</em>
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 flex-wrap justify-center">
              <Link
                to="/taste-compass"
                id="taste-compass"
                className="bg-mustard-accent text-charcoal-dark px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 no-underline hover:bg-mustard-light shadow-lg"
              >
                Start the Quest
              </Link>
              <Link
                to="/tenants"
                className="bg-white/20 text-white border-2 border-white px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 no-underline hover:bg-white/30 shadow-lg"
              >
                Become a Tenant
              </Link>
              <Link
                to="/contact"
                id="contact"
                className="bg-transparent text-white px-8 py-3 text-lg border-2 border-mustard-accent rounded-full transition-all duration-300 no-underline hover:bg-mustard-accent hover:text-charcoal-dark"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-15 px-6">
        <div className="bg-white rounded-2xl p-7 text-center shadow-sm hover:-translate-y-1.5 transition-transform duration-300">
          <span className="text-3xl block mb-3.5">📅</span>
          <h4 className="text-lg font-semibold mb-1.5">Quick Booking</h4>
          <p className="text-sm opacity-85 mb-4.5">Reserve your table</p>
          <Link
            to="/quick-booking"
            className="text-sm font-semibold text-burgundy-primary no-underline hover:underline"
          >
            Book now →
          </Link>
        </div>
        <div className="bg-white rounded-2xl p-7 text-center shadow-sm hover:-translate-y-1.5 transition-transform duration-300">
          <span className="text-3xl block mb-3.5">🚚</span>
          <h4 className="text-lg font-semibold mb-1.5">Delivery</h4>
          <p className="text-sm opacity-85 mb-4.5">Order to your door</p>
          <Link
            to="/delivery-menu"
            className="text-sm font-semibold text-burgundy-primary no-underline hover:underline"
          >
            Order →
          </Link>
        </div>
        <div className="bg-white rounded-2xl p-7 text-center shadow-sm hover:-translate-y-1.5 transition-transform duration-300">
          <span className="text-3xl block mb-3.5">👩‍🍳</span>
          <h4 className="text-lg font-semibold mb-1.5">For Chefs</h4>
          <p className="text-sm opacity-85 mb-4.5">Join our village</p>
          <Link
            to="/become-vendor"
            className="text-sm font-semibold text-burgundy-primary no-underline hover:underline"
          >
            Apply →
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes ken {
          from { transform: scale(1); }
          to { transform: scale(1.06); }
        }
        
        @keyframes rise {
          from { 
            opacity: 0; 
            transform: translateY(18px); 
          }
          to { 
            opacity: 1; 
            transform: none; 
          }
        }
        
        .fade {
          opacity: 0;
          transform: translateY(18px);
          animation: rise 0.8s forwards;
        }
        
        .fade.d2 {
          animation-delay: 0.2s;
        }
        
        .fade.d3 {
          animation-delay: 0.4s;
        }
        
        .fade.d4 {
          animation-delay: 0.6s;
        }
      `}</style>
    </>
  );
};

export default HeroSection;
