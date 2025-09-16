import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, Gift, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PromoCodeValidation {
  valid: boolean;
  discount_type?: string;
  discount_value?: number;
  title?: string;
  description?: string;
  min_order_amount?: number;
  message?: string;
}

export const PromoCodeWidget: React.FC<{
  onCodeApplied?: (discount: number, code: string) => void;
  orderAmount?: number;
}> = ({ onCodeApplied, orderAmount = 0 }) => {
  const [promoCode, setPromoCode] = useState('');
  const [validationResult, setValidationResult] = useState<PromoCodeValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { track } = useAnalytics();
  const { user } = useAuth();

  const validatePromoCode = async (code: string) => {
    if (!code.trim()) {
      setValidationResult(null);
      return;
    }

    setLoading(true);
    try {
      const { data: promoData, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !promoData) {
        setValidationResult({
          valid: false,
          message: 'Промо-код не найден или неактивен'
        });
        return;
      }

      // Проверяем срок действия
      if (promoData.valid_until && new Date(promoData.valid_until) < new Date()) {
        setValidationResult({
          valid: false,
          message: 'Срок действия промо-кода истек'
        });
        return;
      }

      // Проверяем лимит использований
      if (promoData.usage_limit && promoData.usage_count >= promoData.usage_limit) {
        setValidationResult({
          valid: false,
          message: 'Промо-код исчерпан'
        });
        return;
      }

      // Проверяем минимальную сумму заказа
      if (promoData.min_order_amount && orderAmount < promoData.min_order_amount) {
        setValidationResult({
          valid: false,
          message: `Минимальная сумма заказа: IDR ${promoData.min_order_amount.toLocaleString()}`
        });
        return;
      }

      // Проверяем лимит использований пользователем
      if (user) {
        const { data: usageData } = await supabase
          .from('promo_code_usages')
          .select('*')
          .eq('promo_code_id', promoData.id)
          .eq('user_id', user.id);

        if (usageData && usageData.length >= promoData.user_usage_limit) {
          setValidationResult({
            valid: false,
            message: 'Вы уже использовали этот промо-код'
          });
          return;
        }
      }

      setValidationResult({
        valid: true,
        discount_type: promoData.discount_type,
        discount_value: promoData.discount_value,
        title: promoData.title,
        description: promoData.description,
        message: 'Промо-код действителен!'
      });

    } catch (error) {
      console.error('Error validating promo code:', error);
      setValidationResult({
        valid: false,
        message: 'Ошибка проверки промо-кода'
      });
    } finally {
      setLoading(false);
    }
  };

  const applyPromoCode = async () => {
    if (!validationResult?.valid || !promoCode) return;

    try {
      let discountAmount = 0;
      
      if (validationResult.discount_type === 'percentage') {
        discountAmount = Math.round(orderAmount * (validationResult.discount_value! / 100));
      } else if (validationResult.discount_type === 'fixed_amount') {
        discountAmount = validationResult.discount_value!;
      }

      setAppliedCode(promoCode.toUpperCase());
      onCodeApplied?.(discountAmount, promoCode.toUpperCase());
      
      track('promo_code_applied', {
        code: promoCode.toUpperCase(),
        discount_amount: discountAmount,
        order_amount: orderAmount
      });

      toast({
        title: "Промо-код применен!",
        description: `Скидка: IDR ${discountAmount.toLocaleString()}`
      });

    } catch (error) {
      console.error('Error applying promo code:', error);
      toast({
        title: "Ошибка применения",
        description: "Не удалось применить промо-код",
        variant: "destructive"
      });
    }
  };

  const removePromoCode = () => {
    setAppliedCode(null);
    setPromoCode('');
    setValidationResult(null);
    onCodeApplied?.(0, '');
    
    toast({
      title: "Промо-код удален",
      description: "Скидка отменена"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Промо-код
        </CardTitle>
        <CardDescription>
          Введите промо-код для получения скидки
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedCode ? (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Применен код: <strong>{appliedCode}</strong></span>
              <Button variant="outline" size="sm" onClick={removePromoCode}>
                Удалить
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="promo-code">Промо-код</Label>
                <Input
                  id="promo-code"
                  placeholder="Введите код"
                  value={promoCode}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setPromoCode(value);
                    validatePromoCode(value);
                  }}
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={applyPromoCode}
                  disabled={!validationResult?.valid || loading}
                  size="default"
                >
                  Применить
                </Button>
              </div>
            </div>

            {validationResult && (
              <Alert variant={validationResult.valid ? "default" : "destructive"}>
                <AlertDescription>
                  {validationResult.message}
                  {validationResult.valid && validationResult.title && (
                    <div className="mt-2">
                      <strong>{validationResult.title}</strong>
                      {validationResult.description && (
                        <p className="text-sm mt-1">{validationResult.description}</p>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const ReferralWidget: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { track } = useAnalytics();

  // Симуляция реферального кода пользователя
  const referralCode = user?.id ? user.id.slice(0, 8).toUpperCase() : 'GUEST123';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    track('referral_link_copied', { referral_code: referralCode });
    
    toast({
      title: "Ссылка скопирована!",
      description: "Поделитесь ссылкой с друзьями"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Пригласить друзей
        </CardTitle>
        <CardDescription>
          Получайте бонусы за каждого приглашенного друга
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold">Ваши награды</h3>
          <div className="flex justify-center gap-4 mt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">25</div>
              <div className="text-xs text-muted-foreground">Баллов за регистрацию</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">5%</div>
              <div className="text-xs text-muted-foreground">С каждого заказа</div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="referral-code">Ваш реферальный код</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="referral-code"
              value={referralCode}
              readOnly
              className="font-mono"
            />
            <Button variant="outline" onClick={copyReferralLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="referral-link">Реферальная ссылка</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="referral-link"
              value={referralLink}
              readOnly
              className="text-sm"
            />
            <Button variant="outline" onClick={copyReferralLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Приглашено друзей</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Заработано баллов</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};