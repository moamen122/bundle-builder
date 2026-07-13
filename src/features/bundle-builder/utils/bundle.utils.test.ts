import { describe, expect, it } from 'vitest';
import type { BundleData } from '../bundle-builder.types';
import {
  buildInitialActiveVariants,
  buildInitialSelections,
  getReviewSections,
  getStepSelectedCount,
  getTotals,
} from './bundle.utils';

const testData: BundleData = {
  steps: [
    {
      id: 'cameras',
      order: 1,
      icon: 'camera',
      title: 'Choose your cameras',
      products: [
        {
          id: 'cam-a',
          stepId: 'cameras',
          category: 'camera',
          name: 'Cam A',
          image: '/a.svg',
          variants: [
            { id: 'red', label: 'Red', swatch: '#f00' },
            { id: 'blue', label: 'Blue', swatch: '#00f' },
          ],
          defaultVariantId: 'red',
          pricing: { price: 10, compareAt: 20 },
          initialQuantity: 1,
        },
        {
          id: 'cam-b',
          stepId: 'cameras',
          category: 'camera',
          name: 'Cam B',
          image: '/b.svg',
          pricing: { price: 5 },
          initialQuantity: 0,
        },
      ],
    },
    {
      id: 'plan',
      order: 2,
      icon: 'shield',
      title: 'Choose your plan',
      products: [
        {
          id: 'plan-basic',
          stepId: 'plan',
          category: 'plan',
          name: 'Basic',
          image: '/p1.svg',
          pricing: { price: 3 },
          selectionMode: 'single',
          initialQuantity: 0,
        },
        {
          id: 'plan-pro',
          stepId: 'plan',
          category: 'plan',
          name: 'Pro',
          image: '/p2.svg',
          pricing: { price: 9, compareAt: 12 },
          selectionMode: 'single',
          initialQuantity: 1,
        },
      ],
    },
  ],
  shipping: { label: 'Shipping', price: 0, compareAt: 5.99 },
  guarantee: { label: 'Guarantee', heading: 'Returns', description: 'Refund description' },
};

describe('buildInitialSelections', () => {
  it('seeds quantities from each product initialQuantity keyed by its default variant', () => {
    const selections = buildInitialSelections(testData);
    expect(selections['cam-a']).toEqual({ red: 1 });
    expect(selections['cam-b']).toEqual({ default: 0 });
    expect(selections['plan-pro']).toEqual({ default: 1 });
  });
});

describe('buildInitialActiveVariants', () => {
  it('defaults the active variant to defaultVariantId or "default"', () => {
    const active = buildInitialActiveVariants(testData);
    expect(active['cam-a']).toBe('red');
    expect(active['cam-b']).toBe('default');
  });
});

describe('getStepSelectedCount', () => {
  it('counts distinct products with any variant quantity above zero', () => {
    const selections = buildInitialSelections(testData);
    expect(getStepSelectedCount(testData.steps[0], selections)).toBe(1);

    selections['cam-a'] = { red: 2, blue: 3 };
    expect(getStepSelectedCount(testData.steps[0], selections)).toBe(1);

    selections['cam-b'] = { default: 1 };
    expect(getStepSelectedCount(testData.steps[0], selections)).toBe(2);
  });
});

describe('getReviewSections', () => {
  it('lists every variant with quantity above zero as its own line, grouped by category', () => {
    const selections = buildInitialSelections(testData);
    selections['cam-a'] = { red: 2, blue: 1 };

    const sections = getReviewSections(testData, selections);
    const cameraSection = sections.find((section) => section.category === 'camera');

    expect(cameraSection?.items).toHaveLength(2);
    expect(cameraSection?.items.find((item) => item.variantId === 'red')?.name).toBe(
      'Cam A (Red)',
    );
    expect(cameraSection?.items.find((item) => item.variantId === 'blue')?.lineTotal).toBe(10);
  });

  it('omits categories and variants with zero quantity', () => {
    const selections = buildInitialSelections(testData);
    const sections = getReviewSections(testData, selections);
    const cameraSection = sections.find((section) => section.category === 'camera');
    expect(cameraSection?.items).toHaveLength(1);
    expect(cameraSection?.items[0]?.variantId).toBe('red');
  });
});

describe('getTotals', () => {
  it('computes subtotal, compare-at subtotal, and savings across all line items plus shipping', () => {
    const selections = buildInitialSelections(testData);
    const totals = getTotals(testData, selections);

    // cam-a: 1 * 10 = 10, plan-pro: 1 * 9 = 9, shipping: 0 => subtotal 19
    expect(totals.subtotal).toBe(19);
    // cam-a compareAt: 20, plan-pro compareAt: 12, shipping compareAt: 5.99 => 37.99
    expect(totals.compareAtSubtotal).toBe(37.99);
    expect(totals.savings).toBe(18.99);
  });
});
