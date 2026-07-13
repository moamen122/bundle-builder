import { useBundleStore } from '../../store/useBundleStore';
import type { ReviewLineItem as ReviewLineItemData } from '../../bundle-builder.types';

export function useReviewLineItem(item: ReviewLineItemData) {
  const setQuantity = useBundleStore((state) => state.setQuantity);

  const handleQuantityChange = (nextQuantity: number) => {
    setQuantity(item.productId, item.variantId, nextQuantity);
  };

  return { handleQuantityChange };
}
