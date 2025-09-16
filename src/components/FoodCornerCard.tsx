import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FoodCornerCardProps {
  name: string;
  capacity: string;
  size: string;
  description?: string;
}

const FoodCornerCard = ({ name, capacity, size, description }: FoodCornerCardProps) => {
  return (
    <Card className="food-corner-card group">
      <CardHeader>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-muted-foreground mb-3">{description}</p>
        )}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{capacity}</Badge>
          <Badge variant="outline">{size}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCornerCard;