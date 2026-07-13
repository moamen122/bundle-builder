import type { Meta, StoryObj } from '@storybook/react-vite';
import { createBundleStoreDecorator } from '@/stories/decorators';
import { bundleData } from '../../store/useBundleStore';
import { buildInitialSelections } from '../../utils/bundle.utils';
import { BundleBuilder } from './BundleBuilder';

const meta = {
  title: 'Pages/BundleBuilder',
  component: BundleBuilder,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [createBundleStoreDecorator({ selections: buildInitialSelections(bundleData) })],
} satisfies Meta<typeof BundleBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StepTwoOpen: Story = {
  decorators: [
    createBundleStoreDecorator({
      selections: buildInitialSelections(bundleData),
      openStepId: 'plan',
    }),
  ],
};
