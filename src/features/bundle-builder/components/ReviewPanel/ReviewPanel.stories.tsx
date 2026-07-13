import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { createBundleStoreDecorator } from '@/stories/decorators';
import { bundleData } from '../../store/useBundleStore';
import { buildInitialSelections } from '../../utils/bundle.utils';
import { ReviewPanel } from './ReviewPanel';

function emptySelections() {
  const selections = buildInitialSelections(bundleData);
  for (const productId of Object.keys(selections)) {
    for (const variantId of Object.keys(selections[productId])) {
      selections[productId][variantId] = 0;
    }
  }
  return selections;
}

const meta = {
  title: 'BundleBuilder/ReviewPanel',
  component: ReviewPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ReviewPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SeededBundle: Story = {
  decorators: [createBundleStoreDecorator({ selections: buildInitialSelections(bundleData) })],
};

export const EmptyBundle: Story = {
  decorators: [createBundleStoreDecorator({ selections: emptySelections() })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/Congrats/)).not.toBeInTheDocument();
  },
};

export const SaveForLater: Story = {
  decorators: [createBundleStoreDecorator({ selections: buildInitialSelections(bundleData) })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const saveLink = canvas.getByRole('button', { name: 'Save my system for later' });
    await userEvent.click(saveLink);
    await expect(canvas.getByText('Saved for later ✓')).toBeInTheDocument();
  },
};
