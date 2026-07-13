import { Accordion } from '@base-ui/react/accordion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProductCard } from '../ProductCard';
import { STEP_ICON_MAP } from './StepAccordionItem.const';
import { useStepAccordionItem } from './StepAccordionItem.service';
import type { StepAccordionItemProps } from './StepAccordionItem.types';

export function StepAccordionItem({
  step,
  stepNumber,
  totalSteps,
  nextStep,
}: StepAccordionItemProps) {
  const { selectedCount, goToNextStep } = useStepAccordionItem(step, nextStep);
  const StepIcon = STEP_ICON_MAP[step.icon];
  const isOddCount = step.products.length % 2 === 1;

  return (
    <Accordion.Item value={step.id} className="border-b border-border">
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full flex-col gap-2 px-1 py-5 text-left">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Step {stepNumber} of {totalSteps}
          </span>
          <span className="flex items-center gap-3">
            <StepIcon className="size-5 shrink-0 text-foreground" aria-hidden="true" />
            <span className="flex-1 text-lg font-semibold text-foreground">{step.title}</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-brand">
              {selectedCount} selected
              <ChevronDown className="size-4 group-aria-expanded:hidden" aria-hidden="true" />
              <ChevronUp className="hidden size-4 group-aria-expanded:block" aria-hidden="true" />
            </span>
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="overflow-hidden">
        <div className="flex flex-col gap-4 px-1 pb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {step.products.map((product, index) => (
              <div
                key={product.id}
                className={
                  isOddCount && index === step.products.length - 1 ? 'sm:col-span-2' : undefined
                }
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {nextStep && (
            <button
              type="button"
              onClick={goToNextStep}
              className="self-center rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
            >
              Next: {nextStep.title}
            </button>
          )}
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
