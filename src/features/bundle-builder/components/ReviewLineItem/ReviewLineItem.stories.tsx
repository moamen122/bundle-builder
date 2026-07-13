import type { Meta, StoryObj } from '@storybook/react-vite';
import { createBundleStoreDecorator } from '@/stories/decorators';
import type { ReviewLineItem as ReviewLineItemData } from '../../bundle-builder.types';
import { ReviewLineItem } from './ReviewLineItem';

const standardItem: ReviewLineItemData = {
  productId: 'microsd-256',
  variantId: 'default',
  name: 'Wyze MicroSD Card (256GB)',
  image: '/products/microsd-256.svg',
  quantity: 2,
  unitPrice: 20.98,
  lineTotal: 41.96,
  lineCompareAtTotal: 41.96,
  locked: false,
};

const lockedItem: ReviewLineItemData = {
  productId: 'sense-hub',
  variantId: 'default',
  name: 'Wyze Sense Hub (Required)',
  image: '/products/sense-hub.svg',
  quantity: 1,
  unitPrice: 0,
  unitCompareAt: 29.92,
  lineTotal: 0,
  lineCompareAtTotal: 29.92,
  locked: true,
};

const planItem: ReviewLineItemData = {
  productId: 'plan-unlimited',
  variantId: 'default',
  name: 'Cam Unlimited',
  image: '/products/plan-unlimited.svg',
  quantity: 1,
  unitPrice: 9.99,
  unitCompareAt: 12.99,
  lineTotal: 9.99,
  lineCompareAtTotal: 12.99,
  locked: false,
  billingPeriod: 'month',
};

const meta = {
  title: 'BundleBuilder/ReviewLineItem',
  component: ReviewLineItem,
  tags: ['autodocs'],
  decorators: [createBundleStoreDecorator()],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ReviewLineItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: { item: standardItem },
};

export const LockedRequired: Story = {
  args: { item: lockedItem },
};

export const PlanNoStepper: Story = {
  args: { item: planItem },
};
