
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturesGridProps {
  features: Feature[];
}

const FeaturesGrid = ({ features }: FeaturesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {features.map((feature, index) => (
        <Card key={index} className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturesGrid;
