import React from 'react';

interface TriHitaKaranaCircleProps {
  size?: number;
  className?: string;
}

const TriHitaKaranaCircle: React.FC<TriHitaKaranaCircleProps> = ({
  size = 400,
  className = '',
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.35;
  const innerRadius = size * 0.22;
  const textRadius = (innerRadius + outerRadius) / 2;

  // Helper function to create SVG arc path
  const createArcPath = (
    centerX: number,
    centerY: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);

    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);

    return [
      'M',
      x1,
      y1,
      'A',
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      1,
      x2,
      y2,
      'L',
      x3,
      y3,
      'A',
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      0,
      x4,
      y4,
      'Z',
    ].join(' ');
  };

  // Helper function to get text position
  const getTextPosition = (angle: number, radius: number) => {
    const radian = ((angle - 90) * Math.PI) / 180; // -90 to start from top
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    };
  };

  const sectors = [
    {
      id: 'People',
      label: 'People',
      color: 'hsl(116, 25%, 43%)',
      start: 90,
      end: 210,
      textAngle: 150,
    },
    {
      id: 'Spirit',
      label: 'Spirit',
      color: 'hsl(45, 72%, 53%)',
      start: 210,
      end: 330,
      textAngle: 270,
    },
    {
      id: 'Nature',
      label: 'Nature',
      color: 'hsl(352, 55%, 34%)',
      start: 330,
      end: 450,
      textAngle: 30,
    },
  ];

  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
      >
        {/* Sectors */}
        {sectors.map((sector) => {
          const textPos = getTextPosition(sector.textAngle, textRadius);

          return (
            <g key={sector.id}>
              {/* Sector arc */}
              <path
                d={createArcPath(
                  centerX,
                  centerY,
                  innerRadius,
                  outerRadius,
                  sector.start,
                  sector.end
                )}
                fill={sector.color}
                strokeWidth="0"
              />

              {/* Text positioned on circle */}
              <text
                x={textPos.x}
                y={textPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(var(--charcoal))"
                fontWeight="700"
                fontSize={size * 0.045}
                className="select-none font-display"
              >
                {sector.id}
              </text>
            </g>
          );
        })}

        {/* Center text */}
        <text
          x={centerX}
          y={centerY - size * 0.02}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(var(--charcoal))"
          fontWeight="700"
          fontSize={size * 0.05}
          className="select-none font-display"
        >
          <tspan x={centerX} dy="0">
            Tri
          </tspan>
          <tspan x={centerX} dy={size * 0.045}>
            Hita
          </tspan>
          <tspan x={centerX} dy={size * 0.045}>
            Karana
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default TriHitaKaranaCircle;
