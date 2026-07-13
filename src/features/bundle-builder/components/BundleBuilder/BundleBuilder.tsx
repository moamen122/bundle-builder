import { Accordion } from '@base-ui/react/accordion';
import { StepAccordionItem } from '../StepAccordionItem';
import { ReviewPanel } from '../ReviewPanel';
import { useBundleBuilder } from './BundleBuilder.service';

export function BundleBuilder() {
  const { steps, openStepId, handleValueChange } = useBundleBuilder();

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start lg:px-8">
      <div>
        <h1 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl">Let&apos;s get started!</h1>
        <Accordion.Root value={[openStepId]} onValueChange={handleValueChange}>
          {steps.map((step, index) => (
            <StepAccordionItem
              key={step.id}
              step={step}
              stepNumber={index + 1}
              totalSteps={steps.length}
              nextStep={steps[index + 1]}
            />
          ))}
        </Accordion.Root>
      </div>
      <ReviewPanel />
    </div>
  );
}
