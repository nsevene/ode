import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TasteQuest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const experiences = [
    {
      id: "ode-to-earth",
      title: "Ode to Earth",
      description: "Deep immersion in Balinese culture",
      details: "70%+ local ingredients",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
    },
    {
      id: "ode-to-journey",
      title: "Ode to Journey", 
      description: "Eight taste sectors. One totem",
      details: "Central interactive installation",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop"
    },
    {
      id: "ode-to-chill-1",
      title: "Ode to Chill",
      description: "Modern relaxation space",
      details: "Comfortable seating areas",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    },
    {
      id: "ode-to-night",
      title: "Ode to Night",
      description: "Evening dining experience",
      details: "Atmospheric nighttime setting",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c38a?w=400&h=300&fit=crop"
    }
  ];

  const compassSegments = [
    { label: "Erqi", color: "#F4B942" },
    { label: "Serv", color: "#D97B3A" },
    { label: "Spice", color: "#C85A5A" },
    { label: "Umami", color: "#B83D5E" },
    { label: "Sour-Herb", color: "#8B5A8C" },
    { label: "Local", color: "#4A90B8" },
    { label: "Suren-Sult", color: "#2E8B57" },
    { label: "Vegan", color: "#6B8E23" }
  ];

  return (
    <div className="min-h-screen bg-cream-light p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        {/* Left Side - Text */}
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
            Start Your<br />
            Taste Quest
          </h1>
          <p className="text-lg text-charcoal/70">
            Ready for a journey<br />
            through 8 taste sectors?
          </p>
          <Button 
            className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3 rounded-lg"
            onClick={() => navigate('/taste-compass')}
          >
            START YOUR TASTE QUEST
          </Button>
        </div>

        {/* Right Side - Circular Compass */}
        <div className="relative w-80 h-80 mx-auto">
          <div className="absolute inset-0 rounded-full bg-white shadow-lg">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {compassSegments.map((segment, index) => {
                const angle = (360 / compassSegments.length) * index;
                const nextAngle = (360 / compassSegments.length) * (index + 1);
                const x1 = 100 + 80 * Math.cos((angle - 90) * Math.PI / 180);
                const y1 = 100 + 80 * Math.sin((angle - 90) * Math.PI / 180);
                const x2 = 100 + 80 * Math.cos((nextAngle - 90) * Math.PI / 180);
                const y2 = 100 + 80 * Math.sin((nextAngle - 90) * Math.PI / 180);
                
                const largeArcFlag = nextAngle - angle <= 180 ? "0" : "1";
                
                return (
                  <g key={index}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                    <text
                      x={100 + 60 * Math.cos((angle + 22.5 - 90) * Math.PI / 180)}
                      y={100 + 60 * Math.sin((angle + 22.5 - 90) * Math.PI / 180)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xs font-medium"
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
              {/* Center Circle */}
              <circle
                cx="100"
                cy="100"
                r="35"
                fill="white"
                stroke="#ddd"
                strokeWidth="2"
              />
              <text
                x="100"
                y="95"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-charcoal text-sm font-bold"
              >
                Taste
              </text>
              <text
                x="100"
                y="108"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-charcoal text-sm font-bold"
              >
                Compass
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Experience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {experiences.map((experience) => (
          <Card 
            key={experience.id} 
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={experience.image} 
                alt={experience.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-charcoal mb-2">{experience.title}</h3>
              <p className="text-charcoal/80 mb-1">{experience.description}</p>
              <p className="text-sm text-charcoal/60">{experience.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TasteQuest;