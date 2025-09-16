import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChefHat, Building2 } from "lucide-react";

interface MobileQuickActionsProps {
  onQuickBooking: () => void;
}

const MobileQuickActions = ({ onQuickBooking }: MobileQuickActionsProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="sticky top-20 left-4 right-4 z-60 mx-4 mb-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-md border border-cream-medium/30">
        <div className="grid grid-cols-4 gap-2">
          <div 
            className="flex flex-col items-center p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
            onClick={onQuickBooking}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
              📅
            </div>
            <span className="text-xs font-medium text-charcoal text-center leading-tight">Booking</span>
          </div>
          
          <Link to="/taste-quest" className="flex flex-col items-center p-2 rounded-lg bg-sage-blue/10 hover:bg-sage-blue/20 transition-colors">
            <div className="w-8 h-8 rounded-full bg-sage-blue/20 flex items-center justify-center mb-1">
              🧭
            </div>
            <span className="text-xs font-medium text-charcoal text-center leading-tight">Quest</span>
          </Link>

          <Link to="/kitchens" className="flex flex-col items-center p-2 rounded-lg bg-forest-green/10 hover:bg-forest-green/20 transition-colors">
            <div className="w-8 h-8 rounded-full bg-forest-green/20 flex items-center justify-center mb-1">
              <ChefHat className="w-4 h-4 text-forest-green" />
            </div>
            <span className="text-xs font-medium text-charcoal text-center leading-tight">Kitchens</span>
          </Link>

          <Link to="/spaces" className="flex flex-col items-center p-2 rounded-lg bg-burgundy-primary/10 hover:bg-burgundy-primary/20 transition-colors">
            <div className="w-8 h-8 rounded-full bg-burgundy-primary/20 flex items-center justify-center mb-1">
              <Building2 className="w-4 h-4 text-burgundy-primary" />
            </div>
            <span className="text-xs font-medium text-charcoal text-center leading-tight">Spaces</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileQuickActions;