
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface QuestStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface QuestStepsCardProps {
  questSteps: QuestStep[];
}

const QuestStepsCard = ({ questSteps }: QuestStepsCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {questSteps.map((step, index) => (
        <Card key={step.id} className="group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${step.color} text-white`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    STEP {step.id}
                  </Badge>
                </div>
                <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
            {index < questSteps.length - 1 && (
              <div className="flex justify-center mt-4">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestStepsCard;
