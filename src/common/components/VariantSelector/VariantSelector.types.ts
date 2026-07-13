import type { ProductVariant } from '@/features/bundle-builder/bundle-builder.types';

export interface VariantSelectorProps {
  readonly variants: readonly ProductVariant[];
  readonly activeVariantId: string;
  readonly onSelect: (variantId: string) => void;
}
