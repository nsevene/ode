import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, HelpCircle, Share2, Gift, Zap } from 'lucide-react';

interface FloatingActionButtonProps {
  onHelpClick: () => void;
  onShareClick: () => void;
  onRewardsClick: () => void;
}

const FloatingActionButton = ({
  onHelpClick,
  onShareClick,
  onRewardsClick,
}: FloatingActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: HelpCircle,
      label: 'Help',
      onClick: onHelpClick,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Share2,
      label: 'Share',
      onClick: onShareClick,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: Gift,
      label: 'Rewards',
      onClick: onRewardsClick,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col-reverse items-center space-y-reverse space-y-3">
        {/* Action buttons */}
        <div
          className={`flex flex-col-reverse space-y-reverse space-y-3 transition-all duration-300 ${
            isExpanded
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-4 pointer-events-none'
          }`}
        >
          {actions.map((action, index) => (
            <Button
              key={action.label}
              size="sm"
              className={`w-12 h-12 rounded-full shadow-lg ${action.color} text-white transition-all duration-300 hover:scale-110`}
              onClick={action.onClick}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <action.icon className="h-5 w-5" />
            </Button>
          ))}
        </div>

        {/* Main FAB */}
        <Button
          size="sm"
          className={`w-14 h-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-110 ${
            isExpanded ? 'rotate-45' : ''
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <Zap className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
