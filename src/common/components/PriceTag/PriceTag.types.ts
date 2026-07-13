export interface PriceTagProps {
  readonly price: number;
  readonly compareAt?: number;
  readonly billingPeriod?: 'month';
  readonly align?: 'start' | 'end';
}
