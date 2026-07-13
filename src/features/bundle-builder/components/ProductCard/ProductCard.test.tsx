import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { bundleData, useBundleStore } from '../../store/useBundleStore';
import { buildInitialActiveVariants, buildInitialSelections, findProduct } from '../../utils/bundle.utils';
import { ProductCard } from './ProductCard';

function requireProduct(id: string) {
  const product = findProduct(bundleData, id);
  if (!product) throw new Error(`Fixture product "${id}" not found in bundle data`);
  return product;
}

const camV4 = requireProduct('cam-v4');
const sensehub = requireProduct('sense-hub');
const planBasic = requireProduct('plan-basic');

/** Zeroes every seeded quantity so each test starts from a deterministic, empty bundle. */
function resetStore() {
  localStorage.clear();
  const selections = buildInitialSelections(bundleData);
  for (const productId of Object.keys(selections)) {
    for (const variantId of Object.keys(selections[productId])) {
      selections[productId][variantId] = 0;
    }
  }
  useBundleStore.setState({
    selections,
    activeVariant: buildInitialActiveVariants(bundleData),
    openStepId: bundleData.steps[0]?.id ?? '',
    lastSavedAt: null,
  });
}

describe('ProductCard', () => {
  beforeEach(resetStore);

  it("binds the stepper to the active variant's own quantity", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={camV4} />);

    const increase = screen.getByRole('button', { name: `Increase ${camV4.name} quantity` });
    await user.click(increase);
    await user.click(increase);

    expect(screen.getByText('2')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Black' }));

    expect(screen.getByText('0')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'White' }));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows the selected state once quantity is above zero', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={camV4} />);

    const card = screen.getByTestId('product-card');
    expect(card).toHaveAttribute('data-selected', 'false');

    const increase = screen.getByRole('button', { name: `Increase ${camV4.name} quantity` });
    await user.click(increase);

    expect(card).toHaveAttribute('data-selected', 'true');
  });

  it('disables the stepper for a required, locked product', () => {
    render(<ProductCard product={sensehub} />);
    const increase = screen.getByRole('button', { name: `Increase ${sensehub.name} quantity` });
    const decrease = screen.getByRole('button', { name: `Decrease ${sensehub.name} quantity` });
    expect(increase).toBeDisabled();
    expect(decrease).toBeDisabled();
  });

  it('selecting a single-select plan marks it selected and deselects its sibling', async () => {
    const user = userEvent.setup();
    useBundleStore.getState().setQuantity('plan-unlimited', 'default', 1);
    render(<ProductCard product={planBasic} />);

    expect(useBundleStore.getState().selections['plan-unlimited']?.default).toBe(1);

    await user.click(screen.getByRole('button', { name: 'Select' }));

    expect(useBundleStore.getState().selections['plan-basic']?.default).toBe(1);
    expect(useBundleStore.getState().selections['plan-unlimited']?.default).toBe(0);
    expect(screen.getByRole('button', { name: 'Selected' })).toBeInTheDocument();
  });
});
