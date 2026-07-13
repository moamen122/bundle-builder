import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { createBundleStoreDecorator } from '@/stories/decorators';
import { bundleData } from '../../store/useBundleStore';
import { findProduct } from '../../utils/bundle.utils';
import { ProductCard } from './ProductCard';

function requireProduct(id: string) {
  const product = findProduct(bundleData, id);
  if (!product) throw new Error(`Fixture product "${id}" not found in bundle data`);
  return product;
}

const camV4 = requireProduct('cam-v4');
const doorbell = requireProduct('duo-cam-doorbell');
const senseHub = requireProduct('sense-hub');
const planUnlimited = requireProduct('plan-unlimited');

const meta = {
  title: 'BundleBuilder/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: { product: camV4 },
  decorators: [createBundleStoreDecorator({ selections: { [camV4.id]: { white: 0 } } })],
};

export const Selected: Story = {
  args: { product: camV4 },
  decorators: [createBundleStoreDecorator({ selections: { [camV4.id]: { white: 2 } } })],
};

export const NoBadgeNoVariants: Story = {
  args: { product: doorbell },
  decorators: [createBundleStoreDecorator({ selections: { [doorbell.id]: { default: 0 } } })],
};

export const LockedRequired: Story = {
  args: { product: senseHub },
  decorators: [createBundleStoreDecorator({ selections: { [senseHub.id]: { default: 1 } } })],
};

export const SingleSelectPlan: Story = {
  args: { product: planUnlimited },
  decorators: [createBundleStoreDecorator({ selections: { [planUnlimited.id]: { default: 1 } } })],
};

export const SwitchingVariant: Story = {
  args: { product: camV4 },
  decorators: [
    createBundleStoreDecorator({ selections: { [camV4.id]: { white: 2, black: 0 } } }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('2')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'Black' }));
    await expect(canvas.getByText('0')).toBeInTheDocument();
  },
};
