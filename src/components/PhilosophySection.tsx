import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

interface OdeCardProps {
  title: string;
  subtitle: string;
  img: string;
  link: string;
}

const OdeCard = ({ title, subtitle, img, link }: OdeCardProps) => (
  <Link to={link} className="group block">
    <div className="relative overflow-hidden rounded-2xl h-[330px] cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl">
      <img 
        src={img} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"></div>
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h3 className="font-playfair text-2xl font-bold mb-2">{title}</h3>
        <span className="text-sm opacity-90">{subtitle}</span>
      </div>
    </div>
  </Link>
);

const PhilosophySection = () => {
  const odeCards = [
    {
      title: "ODE TO ORIGIN",
      subtitle: "Flavour at its purest",
      img: "/lovable-uploads/a9572aea-f3e2-4a2c-8e73-8f6a959f389e.png",
      link: "/sustainability"
    },
    {
      title: "ODE TO BALI", 
      subtitle: "Ceremonial island soul",
      img: "/lovable-uploads/ac54db01-aed6-4579-9a66-5ea3579c5cb2.png",
      link: "/experiences"
    },
    {
      title: "ODE TO NIGHT",
      subtitle: "Wine · jazz · electric taste", 
      img: "/lovable-uploads/a6143ebd-fe6e-4b6b-8452-baa56f5278ec.png",
      link: "/wine-staircase"
    },
    {
      title: "ODE TO JOURNEY",
      subtitle: "Your personal flavour map",
      img: "/lovable-uploads/c8e294df-77cb-4505-85a1-e56d3e4a2649.png",
      link: "/taste-compass"
    }
  ];

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Header */}
      <header className="py-6 px-8 text-center">
        <h1 className="font-playfair text-3xl font-bold text-burgundy-primary">
          ODE FOOD HALL · Philosophy
        </h1>
      </header>

      {/* Hero Section with Ken Burns Effect */}
      <section className="relative h-[65vh] min-h-[480px] flex flex-col justify-center items-center overflow-hidden text-center text-white">
        {/* Ken Burns Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/lovable-uploads/7183ec12-e263-49ad-bcf4-46b29c2e0c53.png')`,
            filter: 'brightness(0.6)',
            animation: 'kenBurns 20s infinite alternate linear',
            imageRendering: 'crisp-edges',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-shadow-lg">
            Taste your ODE.
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-mustard-accent text-shadow-md mt-2">
            Four ODES · One journey of flavour
          </h2>
        </div>
      </section>

      {/* Ken Burns Animation Styles */}
      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>

      {/* ODE Cards Grid */}
      <section className="py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {odeCards.map((card, index) => (
            <OdeCard 
              key={index}
              title={card.title}
              subtitle={card.subtitle}
              img={card.img}
              link={card.link}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PhilosophySection;