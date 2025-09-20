import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface AnimatedProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

const AnimatedProgressBar = ({
  value,
  max,
  className,
  showLabel = true,
  label,
}: AnimatedProgressBarProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = (value / max) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">
            {value}/{max}
          </span>
        </div>
      )}
      <Progress
        value={animatedValue}
        className="h-2 transition-all duration-700 ease-out"
      />
    </div>
  );
};

export default AnimatedProgressBar;
