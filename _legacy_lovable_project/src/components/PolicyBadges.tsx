import React from 'react';
import { Badge } from '@/components/ui/badge';

type Props = {
  acHalal?: boolean;
  alcoholAllowed?: boolean;
  bottlesOnly?: boolean;
  noRetail?: boolean;
  noBYO?: boolean;
  age21?: boolean;
  serviceFee5?: boolean;
};

export default function PolicyBadges(p: Props) {
  const items: {
    label: string;
    variant?: 'default' | 'secondary' | 'outline' | 'warning';
  }[] = [];

  if (p.acHalal) items.push({ label: 'AC Halal · 0% ABV', variant: 'default' });
  if (p.alcoholAllowed)
    items.push({ label: 'Alcohol allowed', variant: 'warning' });
  if (p.bottlesOnly)
    items.push({ label: 'Bottles only · on‑premise', variant: 'outline' });
  if (p.noRetail) items.push({ label: 'Retail: NO', variant: 'outline' });
  if (p.noBYO) items.push({ label: 'BYO: NO', variant: 'outline' });
  if (p.age21) items.push({ label: '21+', variant: 'warning' });
  if (p.serviceFee5)
    items.push({ label: 'Service fee 5%', variant: 'secondary' });

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Badge key={index} variant={item.variant || 'default'}>
          {item.label}
        </Badge>
      ))}
    </div>
  );
}
