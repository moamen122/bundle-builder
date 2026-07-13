import { cn } from '@/lib/utils';
import { QuantityStepper } from '@/common/components/QuantityStepper';
import { VariantSelector } from '@/common/components/VariantSelector';
import { PriceTag } from '@/common/components/PriceTag';
import { useProductCard } from './ProductCard.service';
import type { ProductCardProps } from './ProductCard.types';

export function ProductCard({ product }: ProductCardProps) {
  const {
    activeVariantId,
    quantity,
    isSelected,
    handleSelectVariant,
    handleQuantityChange,
    handleSelectSingle,
  } = useProductCard(product);

  const isSingleSelect = product.selectionMode === 'single';

  return (
    <div
      data-testid="product-card"
      data-selected={isSelected}
      className={cn(
        'relative flex flex-col gap-3 rounded-2xl border bg-surface p-4 transition-colors',
        isSelected ? 'border-brand ring-1 ring-brand' : 'border-border',
      )}
    >
      {product.badgeLabel && (
        <span className="absolute -top-3 left-4 rounded-full bg-brand-dark px-3 py-1 text-xs font-semibold text-white">
          {product.badgeLabel}
        </span>
      )}

      <div className="flex gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="size-20 shrink-0 rounded-xl object-contain"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground">{product.description}</p>
          )}
          {product.learnMoreUrl && (
            <a
              href={product.learnMoreUrl}
              className="text-sm font-medium text-brand underline underline-offset-2"
            >
              Learn More
            </a>
          )}
        </div>
      </div>

      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          activeVariantId={activeVariantId}
          onSelect={handleSelectVariant}
        />
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        {isSingleSelect ? (
          <button
            type="button"
            onClick={handleSelectSingle}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors',
              isSelected
                ? 'border-brand bg-brand text-white'
                : 'border-border text-foreground hover:border-brand',
            )}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        ) : (
          <QuantityStepper
            quantity={quantity}
            onChange={handleQuantityChange}
            disabled={product.required}
            ariaLabel={product.name}
          />
        )}
        <PriceTag
          price={product.pricing.price}
          compareAt={product.pricing.compareAt}
          billingPeriod={product.billingPeriod}
        />
      </div>
    </div>
  );
}
