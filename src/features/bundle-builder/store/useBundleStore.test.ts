import { beforeEach, describe, expect, it } from 'vitest';
import { bundleData, useBundleStore } from './useBundleStore';
import { buildInitialActiveVariants, buildInitialSelections } from '../utils/bundle.utils';

function resetStore() {
  localStorage.clear();
  useBundleStore.setState({
    selections: buildInitialSelections(bundleData),
    activeVariant: buildInitialActiveVariants(bundleData),
    openStepId: bundleData.steps[0]?.id ?? '',
    lastSavedAt: null,
  });
}

describe('useBundleStore', () => {
  beforeEach(resetStore);

  it('tracks each variant of a product with its own independent quantity', () => {
    const { setQuantity } = useBundleStore.getState();
    setQuantity('cam-v4', 'white', 2);
    setQuantity('cam-v4', 'black', 5);

    const { selections } = useBundleStore.getState();
    expect(selections['cam-v4']?.white).toBe(2);
    expect(selections['cam-v4']?.black).toBe(5);
  });

  it('switching the active variant does not change any variant quantity', () => {
    const { setQuantity, setActiveVariant } = useBundleStore.getState();
    setQuantity('cam-v4', 'white', 2);
    setActiveVariant('cam-v4', 'black');

    const { selections, activeVariant } = useBundleStore.getState();
    expect(activeVariant['cam-v4']).toBe('black');
    expect(selections['cam-v4']?.white).toBe(2);
    expect(selections['cam-v4']?.black ?? 0).toBe(0);
  });

  it('clamps quantity updates to a non-negative integer', () => {
    const { setQuantity } = useBundleStore.getState();
    setQuantity('cam-v4', 'white', -3);
    expect(useBundleStore.getState().selections['cam-v4']?.white).toBe(0);
  });

  it('selecting a single-select plan deselects the other plan in the same step', () => {
    const { setQuantity } = useBundleStore.getState();
    // plan-unlimited starts selected per seed data
    expect(useBundleStore.getState().selections['plan-unlimited']?.default).toBe(1);

    setQuantity('plan-basic', 'default', 1);

    const { selections } = useBundleStore.getState();
    expect(selections['plan-basic']?.default).toBe(1);
    expect(selections['plan-unlimited']?.default).toBe(0);
  });

  it('records a timestamp when markSaved is called', () => {
    expect(useBundleStore.getState().lastSavedAt).toBeNull();
    useBundleStore.getState().markSaved();
    expect(useBundleStore.getState().lastSavedAt).not.toBeNull();
  });
});
