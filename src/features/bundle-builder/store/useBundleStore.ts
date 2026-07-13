import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bundleDataJson from '../data/bundle.data.json';
import type { ActiveVariantState, BundleData, SelectionState } from '../bundle-builder.types';
import {
  buildInitialActiveVariants,
  buildInitialSelections,
  findProduct,
  resolveDefaultVariantId,
} from '../utils/bundle.utils';

export const bundleData = bundleDataJson as BundleData;

interface BundleStoreState {
  readonly selections: SelectionState;
  readonly activeVariant: ActiveVariantState;
  readonly openStepId: string;
  readonly lastSavedAt: string | null;
  readonly setQuantity: (productId: string, variantId: string, quantity: number) => void;
  readonly setActiveVariant: (productId: string, variantId: string) => void;
  readonly setOpenStep: (stepId: string) => void;
  readonly markSaved: () => void;
}

export const useBundleStore = create<BundleStoreState>()(
  persist(
    (set) => ({
      selections: buildInitialSelections(bundleData),
      activeVariant: buildInitialActiveVariants(bundleData),
      openStepId: bundleData.steps[0]?.id ?? '',
      lastSavedAt: null,

      setQuantity: (productId, variantId, quantity) =>
        set((state) => {
          const product = findProduct(bundleData, productId);
          if (!product) return state;

          const clamped = Math.max(0, Math.round(quantity));

          if (product.selectionMode === 'single') {
            const nextQuantity = clamped > 0 ? 1 : 0;
            const siblingIds = bundleData.steps
              .find((step) => step.id === product.stepId)
              ?.products.map((sibling) => sibling.id) ?? [];

            const nextSelections: SelectionState = { ...state.selections };
            for (const siblingId of siblingIds) {
              if (siblingId === productId) continue;
              const sibling = findProduct(bundleData, siblingId);
              if (!sibling) continue;
              nextSelections[siblingId] = { [resolveDefaultVariantId(sibling)]: 0 };
            }
            nextSelections[productId] = { [variantId]: nextQuantity };

            return { selections: nextSelections };
          }

          return {
            selections: {
              ...state.selections,
              [productId]: {
                ...state.selections[productId],
                [variantId]: clamped,
              },
            },
          };
        }),

      setActiveVariant: (productId, variantId) =>
        set((state) => ({
          activeVariant: { ...state.activeVariant, [productId]: variantId },
        })),

      setOpenStep: (stepId) => set({ openStepId: stepId }),

      markSaved: () => set({ lastSavedAt: new Date().toISOString() }),
    }),
    {
      name: 'bundle-builder-storage',
      partialize: (state) => ({
        selections: state.selections,
        activeVariant: state.activeVariant,
        openStepId: state.openStepId,
        lastSavedAt: state.lastSavedAt,
      }),
    },
  ),
);
