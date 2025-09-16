
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Trophy, Sparkles } from "lucide-react";

interface QuestStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  locked: boolean;
}

interface InteractiveQuestProgressProps {
  steps: QuestStep[];
  currentStep: number;
  onStepClick: (stepId: string) => void;
}

const InteractiveQuestProgress = ({ steps, currentStep, onStepClick }: InteractiveQuestProgressProps) => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completedSteps = steps.filter(step => step.completed).length;
    const newProgress = (completedSteps / steps.length) * 100;
    setProgress(newProgress);
  }, [steps]);

  const getStepStatus = (step: QuestStep, index: number) => {
    if (step.completed) return 'completed';
    if (step.locked) return 'locked';
    if (index === currentStep) return 'current';
    return 'available';
  };

  const getStepColors = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white border-emerald-500';
      case 'current':
        return 'bg-amber-500 text-white border-amber-500 animate-pulse';
      case 'available':
        return 'bg-blue-500 text-white border-blue-500';
      default:
        return 'bg-gray-300 text-gray-500 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-gold-accent" />
          <h3 className="text-2xl font-bold">Quest Progress</h3>
        </div>
        
        <div className="relative">
          <Progress 
            value={progress} 
            className="h-4 bg-gray-200"
          />
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{steps.filter(s => s.completed).length}/{steps.length} Completed</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Interactive Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const colors = getStepColors(status);
          
          return (
            <Card 
              key={step.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                hoveredStep === step.id ? 'ring-2 ring-emerald-500' : ''
              } ${step.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              onClick={() => !step.locked && onStepClick(step.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Step Icon */}
                  <div className={`p-3 rounded-full transition-all duration-300 ${colors}`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                        {step.title}
                      </h4>
                      <Badge variant={status === 'completed' ? 'default' : 'outline'}>
                        {status === 'completed' ? 'Done' : 
                         status === 'current' ? 'Active' : 
                         status === 'locked' ? 'Locked' : 'Ready'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    
                    {/* Step Action */}
                    <div className="flex items-center gap-2">
                      {step.completed ? (
                        <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </span>
                      ) : step.locked ? (
                        <span className="text-gray-500 text-sm">
                          Complete previous steps
                        </span>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-emerald-50 group-hover:border-emerald-300"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          {status === 'current' ? 'Continue' : 'Start'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect Overlay */}
                {hoveredStep === step.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-lg pointer-events-none" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Celebration */}
      {progress === 100 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-emerald-600 animate-pulse" />
              <h3 className="text-2xl font-bold text-emerald-800">Quest Complete!</h3>
              <Sparkles className="h-8 w-8 text-emerald-600 animate-pulse" />
            </div>
            <p className="text-emerald-700 mb-4">
              Congratulations! You've completed the entire Taste Alley quest. 
              Your reward awaits at the Chef's Table!
            </p>
            <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              <Trophy className="h-4 w-4 mr-2" />
              Claim Your Reward
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveQuestProgress;
