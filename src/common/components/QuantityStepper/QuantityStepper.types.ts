export interface QuantityStepperProps {
  readonly quantity: number;
  readonly onChange: (nextQuantity: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly disabled?: boolean;
  readonly ariaLabel: string;
}
