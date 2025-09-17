import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function SuperAdminButton() {
  const { becomeInstantAdmin, user, role, isAuthenticated } = useAuthStore();

  const handleBecomeAdmin = () => {
    console.log('🚀 SUPER ADMIN BUTTON CLICKED!');
    
    // Мгновенно становимся админом
    becomeInstantAdmin('just0aguest@gmail.com');
    
    // Показываем уведомление
    alert('🎉 ВЫ СТАЛИ СУПЕР АДМИНОМ! Обновите страницу (F5)');
    
    // Перезагружаем страницу через секунду
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Если уже админ, показываем статус
  if (isAuthenticated && role === 'admin') {
    return (
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-green-100 border-2 border-green-500 text-green-800 px-6 py-3 rounded-lg flex items-center space-x-3 shadow-lg">
          <Crown className="h-5 w-5" />
          <div>
            <div className="font-bold">СУПЕР АДМИН</div>
            <div className="text-sm">{user?.email}</div>
          </div>
          <Button
            size="sm"
            onClick={() => window.location.href = '/admin'}
            className="bg-green-600 hover:bg-green-700"
          >
            Админ Панель
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        onClick={handleBecomeAdmin}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg border-2 border-red-800"
        size="lg"
      >
        <Zap className="h-5 w-5 mr-2" />
        <Crown className="h-5 w-5 mr-2" />
        СТАТЬ СУПЕР АДМИНОМ
      </Button>
    </div>
  );
}
