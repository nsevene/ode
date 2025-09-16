import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Home, LogIn, ArrowLeft } from 'lucide-react';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-charcoal">
                Доступ запрещен
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-charcoal/70">
                У вас недостаточно прав для доступа к этой странице.
              </p>
              <p className="text-sm text-charcoal/50">
                Обратитесь к администратору для получения доступа.
              </p>
              
              <div className="flex flex-col gap-3 pt-4">
                <Button asChild className="w-full">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    На главную
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти в систему
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Вернуться назад
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
