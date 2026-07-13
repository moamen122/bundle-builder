import { QuantityStepper } from '@/common/components/QuantityStepper';
import { PriceTag } from '@/common/components/PriceTag';
import { useReviewLineItem } from './ReviewLineItem.service';
import type { ReviewLineItemProps } from './ReviewLineItem.types';

export function ReviewLineItem({ item }: ReviewLineItemProps) {
  const { handleQuantityChange } = useReviewLineItem(item);
  const isPlan = item.billingPeriod !== undefined;

  return (
    <div className="flex items-center gap-3 py-3">
      <img
        src={item.image}
        alt={item.name}
        className="size-11 shrink-0 rounded-lg object-contain"
      />
      <span className="flex-1 text-sm font-medium text-foreground">{item.name}</span>
      {!isPlan && (
        <QuantityStepper
          quantity={item.quantity}
          onChange={handleQuantityChange}
          disabled={item.locked}
          ariaLabel={item.name}
        />
      )}
      <PriceTag
        price={isPlan ? item.unitPrice : item.lineTotal}
        compareAt={isPlan ? item.unitCompareAt : item.lineCompareAtTotal}
        billingPeriod={item.billingPeriod}
      />
    </div>
  );
}
