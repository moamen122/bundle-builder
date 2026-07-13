import type { Meta, StoryObj } from '@storybook/react-vite';
import { PriceTag } from './PriceTag';

const meta = {
  title: 'UI/PriceTag',
  component: PriceTag,
  tags: ['autodocs'],
} satisfies Meta<typeof PriceTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PriceOnly: Story = {
  args: { price: 69.98 },
};

export const WithDiscount: Story = {
  args: { price: 27.98, compareAt: 35.98 },
};

export const Free: Story = {
  args: { price: 0, compareAt: 29.92 },
};

export const MonthlyBilling: Story = {
  args: { price: 9.99, compareAt: 12.99, billingPeriod: 'month' },
};
