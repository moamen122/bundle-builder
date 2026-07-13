import type {
  ActiveVariantState,
  BundleData,
  BundleStep,
  BundleTotals,
  Product,
  ProductCategory,
  ReviewLineItem,
  ReviewSection,
  SelectionState,
} from '../bundle-builder.types';

export const DEFAULT_VARIANT_ID = 'default';

/** The variant id used to key a product's quantity/price when it has no color variants. */
export function resolveDefaultVariantId(product: Product): string {
  return product.defaultVariantId ?? DEFAULT_VARIANT_ID;
}

export function getAllProducts(data: BundleData): Product[] {
  return data.steps.flatMap((step) => step.products);
}

export function findProduct(data: BundleData, productId: string): Product | undefined {
  return getAllProducts(data).find((product) => product.id === productId);
}

export function buildInitialSelections(data: BundleData): SelectionState {
  const selections: SelectionState = {};
  for (const product of getAllProducts(data)) {
    selections[product.id] = { [resolveDefaultVariantId(product)]: product.initialQuantity ?? 0 };
  }
  return selections;
}

export function buildInitialActiveVariants(data: BundleData): ActiveVariantState {
  const active: ActiveVariantState = {};
  for (const product of getAllProducts(data)) {
    active[product.id] = resolveDefaultVariantId(product);
  }
  return active;
}

export function getQuantity(
  selections: SelectionState,
  productId: string,
  variantId: string,
): number {
  return selections[productId]?.[variantId] ?? 0;
}

function getTotalQuantityForProduct(selections: SelectionState, productId: string): number {
  const variantQuantities = selections[productId] ?? {};
  return Object.values(variantQuantities).reduce((sum, qty) => sum + qty, 0);
}

export function getStepSelectedCount(step: BundleStep, selections: SelectionState): number {
  return step.products.filter(
    (product) => getTotalQuantityForProduct(selections, product.id) > 0,
  ).length;
}

const CATEGORY_TITLES: Record<ProductCategory, string> = {
  camera: 'Cameras',
  sensor: 'Sensors',
  accessory: 'Accessories',
  plan: 'Plan',
};

const CATEGORY_ORDER: readonly ProductCategory[] = ['camera', 'sensor', 'accessory', 'plan'];

export function getReviewSections(data: BundleData, selections: SelectionState): ReviewSection[] {
  const sections = new Map<ProductCategory, ReviewLineItem[]>();

  for (const product of getAllProducts(data)) {
    const variantQuantities = selections[product.id] ?? {};
    const variants = product.variants ?? [];

    for (const [variantId, quantity] of Object.entries(variantQuantities)) {
      if (quantity <= 0) continue;

      const variantLabel = variants.find((variant) => variant.id === variantId)?.label;
      const name = variantLabel ? `${product.name} (${variantLabel})` : product.name;

      const item: ReviewLineItem = {
        productId: product.id,
        variantId,
        name,
        image: product.image,
        quantity,
        unitPrice: product.pricing.price,
        unitCompareAt: product.pricing.compareAt,
        lineTotal: product.pricing.price * quantity,
        lineCompareAtTotal: (product.pricing.compareAt ?? product.pricing.price) * quantity,
        locked: Boolean(product.required),
        billingPeriod: product.billingPeriod,
      };

      const existing = sections.get(product.category) ?? [];
      existing.push(item);
      sections.set(product.category, existing);
    }
  }

  return CATEGORY_ORDER.filter((category) => sections.has(category)).map((category) => ({
    category,
    title: CATEGORY_TITLES[category],
    items: sections.get(category) ?? [],
  }));
}

export function getTotals(data: BundleData, selections: SelectionState): BundleTotals {
  const sections = getReviewSections(data, selections);
  const allItems = sections.flatMap((section) => section.items);

  const subtotal =
    allItems.reduce((sum, item) => sum + item.lineTotal, 0) + data.shipping.price;
  const compareAtSubtotal =
    allItems.reduce((sum, item) => sum + item.lineCompareAtTotal, 0) +
    (data.shipping.compareAt ?? data.shipping.price);

  const savings = Math.max(0, compareAtSubtotal - subtotal);
  // Simple illustrative financing estimate (not a real financing product): spread over 10 months.
  const financingEstimate = subtotal / 10;

  return {
    subtotal: roundMoney(subtotal),
    compareAtSubtotal: roundMoney(compareAtSubtotal),
    savings: roundMoney(savings),
    financingEstimate: roundMoney(financingEstimate),
  };
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatMoney(value: number): string {
  return `$${roundMoney(value).toFixed(2)}`;
}
