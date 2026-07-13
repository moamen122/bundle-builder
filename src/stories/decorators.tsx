import { useEffect } from 'react';
import type { Decorator } from '@storybook/react-vite';
import { bundleData, useBundleStore } from '@/features/bundle-builder/store/useBundleStore';
import {
  buildInitialActiveVariants,
  buildInitialSelections,
} from '@/features/bundle-builder/utils/bundle.utils';
import type {
  ActiveVariantState,
  SelectionState,
} from '@/features/bundle-builder/bundle-builder.types';

interface BundleStoreOverrides {
  readonly selections?: SelectionState;
  readonly activeVariant?: ActiveVariantState;
  readonly openStepId?: string;
}

/** Seeds the real bundle Zustand store for a story, per project convention: never mock stores. */
export function createBundleStoreDecorator(overrides: BundleStoreOverrides = {}): Decorator {
  return (Story) => {
    useEffect(() => {
      useBundleStore.setState({
        selections: overrides.selections ?? buildInitialSelections(bundleData),
        activeVariant: overrides.activeVariant ?? buildInitialActiveVariants(bundleData),
        openStepId: overrides.openStepId ?? bundleData.steps[0]?.id ?? '',
        lastSavedAt: null,
      });
    }, []);

    return <Story />;
  };
}
