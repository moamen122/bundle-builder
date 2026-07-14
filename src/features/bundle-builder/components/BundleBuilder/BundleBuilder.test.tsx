import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { bundleData, useBundleStore } from '../../store/useBundleStore';
import { buildInitialActiveVariants, buildInitialSelections } from '../../utils/bundle.utils';
import { BundleBuilder } from './BundleBuilder';

function resetStore() {
  localStorage.clear();
  useBundleStore.setState({
    selections: buildInitialSelections(bundleData),
    activeVariant: buildInitialActiveVariants(bundleData),
    openStepId: bundleData.steps[0]?.id ?? '',
    lastSavedAt: null,
  });
}

describe('BundleBuilder', () => {
  beforeEach(resetStore);

  it('collapses the open step when its own trigger is clicked again, instead of waiting for another step to open', async () => {
    const user = userEvent.setup();
    render(<BundleBuilder />);

    // Step 1 is open by default per the seeded state.
    expect(screen.getByText('Wyze Cam v4')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Step 1 of 4/ }));

    expect(screen.queryByText('Wyze Cam v4')).not.toBeInTheDocument();
  });
});
