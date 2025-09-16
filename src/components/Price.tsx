import React from 'react';
import { idrWithWords, formatIDR } from '@/lib/idr';

type Props = { 
  value: number; 
  locale?: 'id'|'ru'; 
  showWords?: boolean;
  className?: string;
};

export default function Price({ value, locale='id', showWords=false, className }: Props) {
  const text = formatIDR(value, { showCode: true });
  const title = showWords ? idrWithWords(value, locale, true) : undefined;
  
  return (
    <span title={title} className={className}>
      {text}
    </span>
  );
}