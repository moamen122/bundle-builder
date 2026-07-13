import type { BundleStep } from '../../bundle-builder.types';

export interface StepAccordionItemProps {
  readonly step: BundleStep;
  readonly stepNumber: number;
  readonly totalSteps: number;
  readonly nextStep?: BundleStep;
}
