export type ProductCategory = 'camera' | 'sensor' | 'accessory' | 'plan';

export type StepIcon = 'camera' | 'shield' | 'sensor' | 'grid';

export type SelectionMode = 'quantity' | 'single';

export interface ProductVariant {
  readonly id: string;
  readonly label: string;
  readonly swatch: string;
}

export interface ProductPricing {
  readonly price: number;
  readonly compareAt?: number;
}

export interface Product {
  readonly id: string;
  readonly stepId: string;
  readonly category: ProductCategory;
  readonly name: string;
  readonly description?: string;
  readonly learnMoreUrl?: string;
  readonly image: string;
  readonly badgeLabel?: string;
  readonly variants?: readonly ProductVariant[];
  readonly defaultVariantId?: string;
  readonly pricing: ProductPricing;
  readonly billingPeriod?: 'month';
  readonly required?: boolean;
  readonly selectionMode?: SelectionMode;
  readonly initialQuantity?: number;
}

export interface BundleStep {
  readonly id: string;
  readonly order: number;
  readonly icon: StepIcon;
  readonly title: string;
  readonly products: readonly Product[];
}

export interface ShippingInfo {
  readonly label: string;
  readonly price: number;
  readonly compareAt?: number;
}

export interface GuaranteeInfo {
  readonly label: string;
  readonly heading: string;
  readonly description: string;
}

export interface BundleData {
  readonly steps: readonly BundleStep[];
  readonly shipping: ShippingInfo;
  readonly guarantee: GuaranteeInfo;
}

/** variantId -> quantity, keyed by productId */
export type SelectionState = Record<string, Record<string, number>>;

/** productId -> currently active/displayed variantId */
export type ActiveVariantState = Record<string, string>;

export interface ReviewLineItem {
  readonly productId: string;
  readonly variantId: string;
  readonly name: string;
  readonly image: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly unitCompareAt?: number;
  readonly lineTotal: number;
  readonly lineCompareAtTotal: number;
  readonly locked: boolean;
  readonly billingPeriod?: 'month';
}

export interface ReviewSection {
  readonly category: ProductCategory;
  readonly title: string;
  readonly items: readonly ReviewLineItem[];
}

export interface BundleTotals {
  readonly subtotal: number;
  readonly compareAtSubtotal: number;
  readonly savings: number;
  readonly financingEstimate: number;
}
