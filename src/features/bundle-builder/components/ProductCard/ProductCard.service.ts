import { useBundleStore } from '../../store/useBundleStore';
import { resolveDefaultVariantId } from '../../utils/bundle.utils';
import type { Product } from '../../bundle-builder.types';

export function useProductCard(product: Product) {
  const selections = useBundleStore((state) => state.selections[product.id]);
  const activeVariant = useBundleStore((state) => state.activeVariant[product.id]);
  const setQuantity = useBundleStore((state) => state.setQuantity);
  const setActiveVariant = useBundleStore((state) => state.setActiveVariant);

  const activeVariantId = activeVariant ?? resolveDefaultVariantId(product);
  const quantity = selections?.[activeVariantId] ?? 0;
  const totalQuantity = Object.values(selections ?? {}).reduce((sum, qty) => sum + qty, 0);
  const isSelected = totalQuantity > 0;

  const handleSelectVariant = (variantId: string) => {
    setActiveVariant(product.id, variantId);
  };

  const handleQuantityChange = (nextQuantity: number) => {
    setQuantity(product.id, activeVariantId, nextQuantity);
  };

  const handleSelectSingle = () => {
    setQuantity(product.id, activeVariantId, isSelected ? 0 : 1);
  };

  return {
    activeVariantId,
    quantity,
    isSelected,
    handleSelectVariant,
    handleQuantityChange,
    handleSelectSingle,
  };
}
