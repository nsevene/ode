import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Copy,
  Edit,
  Trash2,
  Gift,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Percent,
  DollarSign,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PromoCode {
  id: string;
  code: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_item';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  user_usage_limit: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  applicable_to: string[];
}

interface MarketingCampaign {
  id: string;
  name: string;
  type:
    | 'birthday'
    | 'loyalty_tier'
    | 'first_booking'
    | 'return_customer'
    | 'seasonal'
    | 'abandoned_cart';
  trigger_conditions: any;
  discount_type: 'percentage' | 'fixed_amount' | 'free_item' | 'upgrade';
  discount_value: number;
  title: string;
  description: string;
  email_template?: string;
  push_notification_template?: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
}

export const MarketingDashboard: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('promo-codes');
  const [showCreatePromo, setShowCreatePromo] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const { toast } = useToast();
  const { track } = useAnalytics();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [promoResponse, campaignResponse] = await Promise.all([
        supabase
          .from('promo_codes')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('marketing_campaigns')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (promoResponse.data) setPromoCodes(promoResponse.data as PromoCode[]);
      if (campaignResponse.data)
        setCampaigns(campaignResponse.data as MarketingCampaign[]);
    } catch (error) {
      console.error('Error loading marketing data:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные маркетинга',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePromoCode = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_promo_code', {
        prefix: 'MARKETING',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating promo code:', error);
      return (
        'MARKETING' + Math.random().toString(36).substr(2, 6).toUpperCase()
      );
    }
  };

  const createPromoCode = async (formData: Partial<PromoCode>) => {
    try {
      const code = await generatePromoCode();
      const { error } = await supabase.from('promo_codes').insert([
        {
          code,
          title: formData.title || '',
          description: formData.description || '',
          discount_type: formData.discount_type || 'percentage',
          discount_value: formData.discount_value || 0,
          min_order_amount: formData.min_order_amount || 0,
          usage_limit: formData.usage_limit,
          user_usage_limit: formData.user_usage_limit || 1,
          valid_until: formData.valid_until,
          is_active: formData.is_active ?? true,
          applicable_to: formData.applicable_to || [],
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Промо-код создан',
        description: `Код ${code} успешно создан`,
      });

      track('promo_code_created', {
        code,
        discount_type: formData.discount_type,
      });
      loadData();
      setShowCreatePromo(false);
    } catch (error) {
      console.error('Error creating promo code:', error);
      toast({
        title: 'Ошибка создания',
        description: 'Не удалось создать промо-код',
        variant: 'destructive',
      });
    }
  };

  const createCampaign = async (formData: Partial<MarketingCampaign>) => {
    try {
      const { error } = await supabase.from('marketing_campaigns').insert([
        {
          name: formData.name || '',
          type: formData.type || 'first_booking',
          trigger_conditions: formData.trigger_conditions || {},
          discount_type: formData.discount_type || 'percentage',
          discount_value: formData.discount_value || 0,
          title: formData.title || '',
          description: formData.description || '',
          email_template: formData.email_template,
          push_notification_template: formData.push_notification_template,
          is_active: formData.is_active ?? true,
          start_date: formData.start_date || new Date().toISOString(),
          end_date: formData.end_date,
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Кампания создана',
        description: 'Маркетинговая кампания успешно создана',
      });

      track('marketing_campaign_created', { type: formData.type });
      loadData();
      setShowCreateCampaign(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Ошибка создания',
        description: 'Не удалось создать кампанию',
        variant: 'destructive',
      });
    }
  };

  const togglePromoCode = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      track('promo_code_toggled', { id, is_active: isActive });
      loadData();
    } catch (error) {
      console.error('Error toggling promo code:', error);
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Скопировано',
      description: `Промо-код ${code} скопирован в буфер обмена`,
    });
    track('promo_code_copied', { code });
  };

  const formatDiscount = (type: string, value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'fixed_amount':
        return `IDR ${value.toLocaleString()}`;
      case 'free_item':
        return 'Бесплатный товар';
      default:
        return value.toString();
    }
  };

  const getUsageProgress = (used: number, limit?: number) => {
    if (!limit) return 0;
    return (used / limit) * 100;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Загрузка...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Маркетинг и продажи</h1>
          <p className="text-muted-foreground">
            Управление промо-кодами, кампаниями и программой лояльности
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные промо-коды
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promoCodes.filter((p) => p.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Всего: {promoCodes.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные кампании
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Всего: {campaigns.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Общее использование
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promoCodes.reduce((sum, p) => sum + p.usage_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Всего активаций</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Средняя скидка
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15%</div>
            <p className="text-xs text-muted-foreground">
              В среднем по промо-кодам
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promo-codes">Промо-коды</TabsTrigger>
          <TabsTrigger value="campaigns">Кампании</TabsTrigger>
          <TabsTrigger value="referrals">Рефералы</TabsTrigger>
        </TabsList>

        <TabsContent value="promo-codes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Промо-коды</h2>
            <Dialog open={showCreatePromo} onOpenChange={setShowCreatePromo}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать промо-код
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Новый промо-код</DialogTitle>
                  <DialogDescription>
                    Создание нового промо-кода для клиентов
                  </DialogDescription>
                </DialogHeader>
                <PromoCodeForm onSubmit={createPromoCode} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Код</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Скидка</TableHead>
                    <TableHead>Использование</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-mono font-medium">
                        {promo.code}
                      </TableCell>
                      <TableCell>{promo.title}</TableCell>
                      <TableCell>
                        {formatDiscount(
                          promo.discount_type,
                          promo.discount_value
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{promo.usage_count}</span>
                            <span>{promo.usage_limit || '∞'}</span>
                          </div>
                          {promo.usage_limit && (
                            <Progress
                              value={getUsageProgress(
                                promo.usage_count,
                                promo.usage_limit
                              )}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={promo.is_active ? 'default' : 'secondary'}
                        >
                          {promo.is_active ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyPromoCode(promo.code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Switch
                            checked={promo.is_active}
                            onCheckedChange={(checked) =>
                              togglePromoCode(promo.id, checked)
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Маркетинговые кампании</h2>
            <Dialog
              open={showCreateCampaign}
              onOpenChange={setShowCreateCampaign}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать кампанию
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Новая кампания</DialogTitle>
                  <DialogDescription>
                    Создание автоматической маркетинговой кампании
                  </DialogDescription>
                </DialogHeader>
                <CampaignForm onSubmit={createCampaign} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className={
                  campaign.is_active ? 'border-green-200' : 'border-gray-200'
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge
                      variant={campaign.is_active ? 'default' : 'secondary'}
                    >
                      {campaign.is_active ? 'Активна' : 'Неактивна'}
                    </Badge>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Тип:</span>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Скидка:</span>
                      <span>
                        {formatDiscount(
                          campaign.discount_type,
                          campaign.discount_value
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Период:</span>
                      <span>
                        {new Date(campaign.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <ReferralProgram />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Form components
const PromoCodeForm: React.FC<{
  onSubmit: (data: Partial<PromoCode>) => void;
}> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'percentage' as const,
    discount_value: 10,
    min_order_amount: 0,
    usage_limit: 100,
    user_usage_limit: 1,
    valid_until: '',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discount_type">Тип скидки</Label>
          <Select
            value={formData.discount_type}
            onValueChange={(value: any) =>
              setFormData({ ...formData, discount_type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Процент</SelectItem>
              <SelectItem value="fixed_amount">Фиксированная сумма</SelectItem>
              <SelectItem value="free_item">Бесплатный товар</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="discount_value">Значение скидки</Label>
          <Input
            id="discount_value"
            type="number"
            value={formData.discount_value}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount_value: parseInt(e.target.value),
              })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="usage_limit">Лимит использований</Label>
          <Input
            id="usage_limit"
            type="number"
            value={formData.usage_limit}
            onChange={(e) =>
              setFormData({
                ...formData,
                usage_limit: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="valid_until">Действителен до</Label>
          <Input
            id="valid_until"
            type="date"
            value={formData.valid_until}
            onChange={(e) =>
              setFormData({ ...formData, valid_until: e.target.value })
            }
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Создать промо-код
      </Button>
    </form>
  );
};

const CampaignForm: React.FC<{
  onSubmit: (data: Partial<MarketingCampaign>) => void;
}> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'first_booking' as const,
    trigger_conditions: {},
    discount_type: 'percentage' as const,
    discount_value: 10,
    title: '',
    description: '',
    email_template: '',
    is_active: true,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Название кампании</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Тип кампании</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first_booking">Первое бронирование</SelectItem>
              <SelectItem value="return_customer">
                Возвращающийся клиент
              </SelectItem>
              <SelectItem value="birthday">День рождения</SelectItem>
              <SelectItem value="loyalty_tier">Уровень лояльности</SelectItem>
              <SelectItem value="seasonal">Сезонная</SelectItem>
              <SelectItem value="abandoned_cart">Брошенная корзина</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Заголовок предложения</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discount_type">Тип скидки</Label>
          <Select
            value={formData.discount_type}
            onValueChange={(value: any) =>
              setFormData({ ...formData, discount_type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Процент</SelectItem>
              <SelectItem value="fixed_amount">Фиксированная сумма</SelectItem>
              <SelectItem value="free_item">Бесплатный товар</SelectItem>
              <SelectItem value="upgrade">Апгрейд</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="discount_value">Значение скидки</Label>
          <Input
            id="discount_value"
            type="number"
            value={formData.discount_value}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount_value: parseInt(e.target.value),
              })
            }
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Создать кампанию
      </Button>
    </form>
  );
};

const ReferralProgram: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Реферальная программа</CardTitle>
          <CardDescription>
            Настройка и управление программой рефералов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">За регистрацию</h3>
              <p className="text-2xl font-bold text-primary">25 баллов</p>
              <p className="text-sm text-muted-foreground">Каждому участнику</p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">За бронирование</h3>
              <p className="text-2xl font-bold text-primary">5%</p>
              <p className="text-sm text-muted-foreground">От суммы заказа</p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <Gift className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Бонус за этап</h3>
              <p className="text-2xl font-bold text-primary">100 баллов</p>
              <p className="text-sm text-muted-foreground">За 10 рефералов</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingDashboard;
