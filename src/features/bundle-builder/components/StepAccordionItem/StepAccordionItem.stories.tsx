import { Accordion } from '@base-ui/react/accordion';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { createBundleStoreDecorator } from '@/stories/decorators';
import { bundleData } from '../../store/useBundleStore';
import { buildInitialSelections } from '../../utils/bundle.utils';
import { StepAccordionItem } from './StepAccordionItem';

const camerasStep = bundleData.steps[0];
const planStep = bundleData.steps[1];

function AccordionWrapper({ children, openStepId }: { children: React.ReactNode; openStepId: string }) {
  return (
    <Accordion.Root value={[openStepId]} onValueChange={() => {}} className="w-[700px]">
      {children}
    </Accordion.Root>
  );
}

const meta = {
  title: 'BundleBuilder/StepAccordionItem',
  component: StepAccordionItem,
  tags: ['autodocs'],
  decorators: [createBundleStoreDecorator({ selections: buildInitialSelections(bundleData) })],
} satisfies Meta<typeof StepAccordionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    step: camerasStep,
    stepNumber: 1,
    totalSteps: 4,
    nextStep: planStep,
  },
  render: (args) => (
    <AccordionWrapper openStepId={camerasStep.id}>
      <StepAccordionItem {...args} />
    </AccordionWrapper>
  ),
};

export const Collapsed: Story = {
  args: {
    step: camerasStep,
    stepNumber: 1,
    totalSteps: 4,
    nextStep: planStep,
  },
  render: (args) => (
    <AccordionWrapper openStepId="plan">
      <StepAccordionItem {...args} />
    </AccordionWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('2 selected')).toBeInTheDocument();
  },
};

export const LastStepHasNoNextButton: Story = {
  args: {
    step: bundleData.steps[3],
    stepNumber: 4,
    totalSteps: 4,
    nextStep: undefined,
  },
  render: (args) => (
    <AccordionWrapper openStepId={bundleData.steps[3].id}>
      <StepAccordionItem {...args} />
    </AccordionWrapper>
  ),
};
