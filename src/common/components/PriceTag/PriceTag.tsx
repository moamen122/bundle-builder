import { cn } from '@/lib/utils';
import { formatMoney } from '@/features/bundle-builder/utils/bundle.utils';
import type { PriceTagProps } from './PriceTag.types';

export function PriceTag({ price, compareAt, billingPeriod, align = 'end' }: PriceTagProps) {
  const hasDiscount = compareAt !== undefined && compareAt > price;
  const suffix = billingPeriod === 'month' ? '/mo' : '';

  return (
    <div className={cn('flex flex-col leading-tight', align === 'end' ? 'items-end' : 'items-start')}>
      {hasDiscount && (
        <span className="text-xs text-muted-foreground line-through">
          {formatMoney(compareAt)}
          {suffix}
        </span>
      )}
      <span className="text-sm font-semibold text-brand">
        {price === 0 ? 'FREE' : `${formatMoney(price)}${suffix}`}
      </span>
    </div>
  );
}
