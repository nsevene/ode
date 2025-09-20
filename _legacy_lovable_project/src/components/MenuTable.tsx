import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatIDR } from '@/lib/idr';

interface MenuItem {
  category: string;
  item: string;
  price: string;
  allergens?: string;
  description?: string;
}

interface MenuTableProps {
  items?: MenuItem[];
}

export default function MenuTable({ items = [] }: MenuTableProps) {
  const [menuData, setMenuData] = React.useState<MenuItem[]>(items);
  const [loading, setLoading] = React.useState(items.length === 0);

  React.useEffect(() => {
    if (items.length === 0) {
      // Fetch from Supabase Edge Function
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cms-menu`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          setMenuData(data.items || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch menu:', err);
          setLoading(false);
        });
    }
  }, [items.length]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Загрузка меню...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (menuData.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Меню не найдено</p>
        </CardContent>
      </Card>
    );
  }

  // Group by category
  const groupedMenu = menuData.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupedMenu).map(([category, categoryItems]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-xl uppercase">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Блюдо</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Аллергены</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryItems.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.item}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.price && !isNaN(Number(item.price))
                        ? formatIDR(Number(item.price))
                        : item.price}
                    </TableCell>
                    <TableCell>
                      {item.allergens && (
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.split(',').map((allergen, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {allergen.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <div className="text-xs text-muted-foreground text-center">
        * Цены включают service fee 5%
      </div>
    </div>
  );
}
