import { useEffect, useRef } from 'react';

interface QRCodeGeneratorProps {
  text: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator = ({ text, size = 120, className = "" }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;

      // Simple QR code pattern generator (placeholder)
      const modules = 25; // QR code matrix size
      const moduleSize = size / modules;

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Generate a simple pattern based on text
      ctx.fillStyle = '#000000';
      const hash = text.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);

      // Draw QR-like pattern
      for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
          const shouldFill = ((row * col + hash) % 3) === 0;
          
          // Always fill corner squares (position detection patterns)
          const isCorner = 
            (row < 7 && col < 7) ||
            (row < 7 && col >= modules - 7) ||
            (row >= modules - 7 && col < 7);
          
          if (shouldFill || isCorner) {
            ctx.fillRect(
              col * moduleSize,
              row * moduleSize,
              moduleSize - 1,
              moduleSize - 1
            );
          }
        }
      }

      // Draw finder patterns (corner squares)
      const drawFinderPattern = (x: number, y: number) => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
      };

      drawFinderPattern(0, 0);
      drawFinderPattern((modules - 7) * moduleSize, 0);
      drawFinderPattern(0, (modules - 7) * moduleSize);
    };

    generateQR();
  }, [text, size]);

  return (
    <canvas 
      ref={canvasRef}
      className={`border border-gray-300 rounded ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default QRCodeGenerator;