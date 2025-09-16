
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Trophy, 
  Star, 
  Smartphone,
  Users,
  Gift,
  MapPin,
  Target
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  tips: string[];
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TutorialModal = ({ isOpen, onClose, onComplete }: TutorialModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Добро пожаловать в Taste Alley!',
      description: 'Откройте для себя захватывающий мир вкусовых приключений через интерактивные квесты и достижения.',
      icon: <Star className="h-8 w-8 text-amber-500" />,
      tips: [
        'Проходите 4 уникальных сектора',
        'Зарабатывайте очки и достижения',
        'Соревнуйтесь с другими игроками'
      ]
    },
    {
      id: 'sectors',
      title: 'Исследуйте 4 сектора',
      description: 'Каждый сектор предлагает уникальные вкусовые испытания и интерактивные элементы.',
      icon: <MapPin className="h-8 w-8 text-emerald-500" />,
      tips: [
        'FERMENT 🧪 - Искусство ферментации',
        'SMOKE 🔥 - Традиции копчения',
        'SPICE 🌶️ - Пряные маршруты',
        'UMAMI 🐟 - Секреты пятого вкуса'
      ]
    },
    {
      id: 'progress',
      title: 'Отслеживайте прогресс',
      description: 'Следите за своими достижениями, уровнем и позицией в таблице лидеров.',
      icon: <Target className="h-8 w-8 text-blue-500" />,
      tips: [
        'Зарабатывайте очки за прохождение секторов',
        'Повышайте уровень за активность',
        'Получайте достижения за особые успехи'
      ]
    },
    {
      id: 'achievements',
      title: 'Собирайте достижения',
      description: 'Разблокируйте уникальные награды и значки за выполнение специальных заданий.',
      icon: <Trophy className="h-8 w-8 text-purple-500" />,
      tips: [
        'Различные типы достижений',
        'Редкие и эпические награды',
        'Дополнительные очки за достижения'
      ]
    },
    {
      id: 'rewards',
      title: 'Получайте награды',
      description: 'Обменивайте накопленные очки на реальные призы и скидки.',
      icon: <Gift className="h-8 w-8 text-pink-500" />,
      tips: [
        'Скидки на еду и напитки',
        'Эксклюзивные мероприятия',
        'Фирменные сувениры'
      ]
    },
    {
      id: 'social',
      title: 'Делитесь успехами',
      description: 'Рассказывайте о своих достижениях в социальных сетях и приглашайте друзей.',
      icon: <Users className="h-8 w-8 text-orange-500" />,
      tips: [
        'Делитесь в Instagram, Facebook, Twitter',
        'Приглашайте друзей по реферальным кодам',
        'Соревнуйтесь с другими игроками'
      ]
    },
    {
      id: 'nfc',
      title: 'Используйте NFC',
      description: 'Сканируйте NFC-метки в секторах для получения дополнительных очков и контента.',
      icon: <Smartphone className="h-8 w-8 text-green-500" />,
      tips: [
        'Приложите телефон к NFC-метке',
        'Получайте мгновенные очки',
        'Разблокируйте скрытый контент'
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    onComplete();
    onClose();
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-emerald-600" />
            Обучение Taste Alley
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          {/* Step Counter */}
          <div className="text-center text-sm text-muted-foreground">
            Шаг {currentStep + 1} из {tutorialSteps.length}
          </div>

          {/* Step Content */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {currentStepData.icon}
                </div>
                
                <h3 className="text-xl font-bold text-emerald-800">
                  {currentStepData.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Tips */}
                <div className="space-y-2">
                  {currentStepData.tips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>

            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-emerald-600' 
                      : index < currentStep 
                        ? 'bg-emerald-300' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button 
                onClick={completeTutorial}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Начать квест!
                <Play className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={nextStep}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Далее
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Skip Button */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                onComplete();
                onClose();
              }}
            >
              Пропустить обучение
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;
