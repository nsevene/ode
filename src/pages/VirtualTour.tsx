import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, Environment, Html } from '@react-three/drei';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Info, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';

interface ZoneInfo {
  name: string;
  description: string;
  cuisine: string;
  position: [number, number, number];
  color: string;
  link: string;
}

const zones: ZoneInfo[] = [
  {
    name: 'Wild Bali',
    description: 'Аутентичная балийская кухня с тропическими вкусами',
    cuisine: 'Балийская',
    position: [-4, 0.5, -2],
    color: '#22c55e',
    link: '/vendor/wild-bali'
  },
  {
    name: 'Dolce Italia',
    description: 'Традиционная итальянская кухня и свежая паста',
    cuisine: 'Итальянская',
    position: [0, 0.5, -4],
    color: '#ef4444',
    link: '/vendor/dolce-italia'
  },
  {
    name: 'Spicy Asia',
    description: 'Острые азиатские блюда и уличная еда',
    cuisine: 'Азиатская',
    position: [4, 0.5, -2],
    color: '#f59e0b',
    link: '/vendor/spicy-asia'
  },
  {
    name: 'Fresh & Healthy',
    description: 'Свежие салаты и здоровое питание',
    cuisine: 'Здоровая еда',
    position: [-2, 0.5, 2],
    color: '#10b981',
    link: '#'
  },
  {
    name: 'Grill Masters',
    description: 'Премиальные стейки и барбекю',
    cuisine: 'Гриль',
    position: [2, 0.5, 2],
    color: '#8b5cf6',
    link: '#'
  },
  {
    name: 'Wine Staircase',
    description: 'Винный погреб с эксклюзивной коллекцией',
    cuisine: 'Винотека',
    position: [0, 0.5, 4],
    color: '#6366f1',
    link: '/wine-staircase'
  }
];

// Zone component with interactive elements
function Zone({ zone, onClick }: { zone: ZoneInfo; onClick: (zone: ZoneInfo) => void }) {
  const meshRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y = zone.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={zone.position}>
      {/* Base platform */}
      <Box
        ref={meshRef}
        args={[2, 0.2, 2]}
        position={[0, -0.1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(zone)}
      >
        <meshStandardMaterial 
          color={hovered ? zone.color : '#f3f4f6'} 
          transparent
          opacity={0.8}
        />
      </Box>
      
      {/* Zone pillar */}
      <Box args={[0.2, 2, 0.2]} position={[0, 1, 0]}>
        <meshStandardMaterial color={zone.color} />
      </Box>
      
      {/* Zone name text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color={zone.color}
        anchorX="center"
        anchorY="middle"
      >
        {zone.name}
      </Text>
      
      {/* Info icon */}
      {hovered && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-background/90 p-2 rounded-lg shadow-lg animate-fade-in">
            <Info className="w-4 h-4 text-primary" />
          </div>
        </Html>
      )}
    </group>
  );
}

// Main hall environment
function FoodHall({ onZoneClick }: { onZoneClick: (zone: ZoneInfo) => void }) {
  return (
    <>
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f8fafc" />
      </Plane>
      
      {/* Walls */}
      <Plane args={[20, 8]} position={[0, 4, -10]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Plane>
      <Plane args={[20, 8]} position={[10, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Plane>
      <Plane args={[20, 8]} position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Plane>
      
      {/* Ceiling */}
      <Plane args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <meshStandardMaterial color="#f1f5f9" />
      </Plane>
      
      {/* Central fountain/decoration */}
      <Box args={[1, 1, 1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.4} />
      </Box>
      
      {/* Zone areas */}
      {zones.map((zone, index) => (
        <Zone key={index} zone={zone} onClick={onZoneClick} />
      ))}
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 6, 0]} intensity={0.5} color="#f59e0b" />
    </>
  );
}

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Загрузка 3D тура...</p>
      </div>
    </Html>
  );
}

const VirtualTour = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Временно перенаправляем на fallback до исправления ошибки Three.js
    navigate('/virtual-tour-fallback');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Перенаправление на карту...</p>
      </div>
    </div>
  );
};

export default VirtualTour;