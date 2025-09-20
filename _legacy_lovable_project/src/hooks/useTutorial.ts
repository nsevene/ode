import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useTutorial = () => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      // Проверяем, проходил ли пользователь туториал
      const completedKey = `tutorial_completed_${user.id}`;
      const completed = localStorage.getItem(completedKey) === 'true';

      setTutorialCompleted(completed);

      // Показываем туториал только если он не был завершен
      if (!completed) {
        // Небольшая задержка для лучшего UX
        setTimeout(() => {
          setShowTutorial(true);
        }, 1000);
      }
    }
  }, [user]);

  const completeTutorial = () => {
    if (user) {
      const completedKey = `tutorial_completed_${user.id}`;
      localStorage.setItem(completedKey, 'true');
      setTutorialCompleted(true);
      setShowTutorial(false);
    }
  };

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  return {
    showTutorial,
    tutorialCompleted,
    startTutorial,
    closeTutorial,
    completeTutorial,
  };
};
