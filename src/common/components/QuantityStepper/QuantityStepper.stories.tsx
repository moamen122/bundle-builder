import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { QuantityStepper } from './QuantityStepper';

function ControlledStepper(props: { initialQuantity?: number; disabled?: boolean }) {
  const [quantity, setQuantity] = useState(props.initialQuantity ?? 0);
  return (
    <QuantityStepper
      quantity={quantity}
      onChange={setQuantity}
      disabled={props.disabled}
      ariaLabel="Wyze Cam v4"
    />
  );
}

const meta = {
  title: 'UI/QuantityStepper',
  component: ControlledStepper,
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initialQuantity: 1 },
};

export const AtMinimum: Story = {
  args: { initialQuantity: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const decrease = canvas.getByRole('button', { name: /Decrease/ });
    await expect(decrease).toBeDisabled();
  },
};

export const Disabled: Story = {
  args: { initialQuantity: 1, disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Increase/ })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: /Decrease/ })).toBeDisabled();
  },
};

export const Interactive: Story = {
  args: { initialQuantity: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const increase = canvas.getByRole('button', { name: /Increase/ });
    await userEvent.click(increase);
    await userEvent.click(increase);
    await expect(canvas.getByText('2')).toBeInTheDocument();
  },
};
