import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { VariantSelector } from './VariantSelector';
import type { ProductVariant } from '@/features/bundle-builder/bundle-builder.types';

const VARIANTS: readonly ProductVariant[] = [
  { id: 'white', label: 'White', swatch: '#f4f4f4' },
  { id: 'grey', label: 'Grey', swatch: '#8a8a8a' },
  { id: 'black', label: 'Black', swatch: '#1c1c1c' },
];

function ControlledVariantSelector() {
  const [activeVariantId, setActiveVariantId] = useState(VARIANTS[0].id);
  return (
    <VariantSelector
      variants={VARIANTS}
      activeVariantId={activeVariantId}
      onSelect={setActiveVariantId}
    />
  );
}

const meta = {
  title: 'UI/VariantSelector',
  component: ControlledVariantSelector,
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledVariantSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SelectingAVariant: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blackChip = canvas.getByRole('radio', { name: 'Black' });
    await userEvent.click(blackChip);
    await expect(blackChip).toHaveAttribute('aria-checked', 'true');
  },
};
