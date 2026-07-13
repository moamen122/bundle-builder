import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { bundleData, useBundleStore } from '../../store/useBundleStore';
import { buildInitialActiveVariants, buildInitialSelections } from '../../utils/bundle.utils';
import { ReviewPanel } from './ReviewPanel';

function resetStore() {
  localStorage.clear();
  useBundleStore.setState({
    selections: buildInitialSelections(bundleData),
    activeVariant: buildInitialActiveVariants(bundleData),
    openStepId: bundleData.steps[0]?.id ?? '',
    lastSavedAt: null,
  });
}

describe('ReviewPanel', () => {
  beforeEach(resetStore);

  it('lists the seeded selections grouped under their category headings', () => {
    render(<ReviewPanel />);
    expect(screen.getByText('Cameras')).toBeInTheDocument();
    expect(screen.getByText('Sensors')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Wyze Cam v4 (White)')).toBeInTheDocument();
    expect(screen.getByText('Cam Unlimited')).toBeInTheDocument();
  });

  it('recalculates the total when a line item quantity changes', async () => {
    const user = userEvent.setup();
    render(<ReviewPanel />);

    const before = screen.getByText(/^\$\d/, {
      selector: 'span.text-2xl',
    }).textContent;

    const increase = screen.getByRole('button', {
      name: 'Increase Wyze Cam v4 (White) quantity',
    });
    await user.click(increase);

    const after = screen.getByText(/^\$\d/, { selector: 'span.text-2xl' }).textContent;
    expect(after).not.toBe(before);
  });

  it('does not render a quantity stepper for the plan line item', () => {
    render(<ReviewPanel />);
    expect(
      screen.queryByRole('group', { name: 'Cam Unlimited' }),
    ).not.toBeInTheDocument();
  });

  it('shows a confirmation once the system is saved for later', async () => {
    const user = userEvent.setup();
    render(<ReviewPanel />);

    expect(screen.getByRole('button', { name: 'Save my system for later' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save my system for later' }));

    expect(screen.getByRole('button', { name: 'Saved for later ✓' })).toBeInTheDocument();
  });

  it('shows a confirmation once checkout is clicked', async () => {
    const user = userEvent.setup();
    render(<ReviewPanel />);

    await user.click(screen.getByRole('button', { name: 'Checkout' }));

    expect(screen.getByText(/Order placed/)).toBeInTheDocument();
  });
});
