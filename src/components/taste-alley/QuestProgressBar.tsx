
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface QuestStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  completed?: boolean;
  current?: boolean;
}

interface QuestProgressBarProps {
  questSteps: QuestStep[];
  currentStep: number;
  completedSteps: number;
}

const QuestProgressBar = ({ questSteps, currentStep, completedSteps }: QuestProgressBarProps) => {
  const progressPercentage = (completedSteps / questSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Quest Progress</h3>
        <p className="text-muted-foreground">
          {completedSteps} of {questSteps.length} steps completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <Progress 
          value={progressPercentage} 
          className="h-3 bg-emerald-100"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-20 animate-pulse" />
      </div>

      {/* Steps Timeline */}
      <div className="space-y-4">
        {questSteps.map((step, index) => {
          const isCompleted = index < completedSteps;
          const isCurrent = index === currentStep;
          
          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                isCompleted 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : isCurrent 
                  ? 'bg-amber-50 border-amber-200 animate-pulse' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                  ? 'bg-emerald-500 text-white' 
                  : isCurrent 
                  ? 'bg-amber-500 text-white animate-bounce' 
                  : 'bg-gray-300 text-gray-500'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6" />
                ) : isCurrent ? (
                  <Clock className="h-6 w-6" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold ${
                    isCompleted ? 'text-emerald-700' : isCurrent ? 'text-amber-700' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h4>
                  <Badge variant={isCompleted ? 'default' : isCurrent ? 'secondary' : 'outline'}>
                    Step {step.id}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {isCompleted && (
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                    Completed
                  </Badge>
                )}
                {isCurrent && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                    Current
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestProgressBar;
