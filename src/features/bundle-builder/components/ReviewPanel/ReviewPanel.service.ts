import { useState } from 'react';
import { bundleData, useBundleStore } from '../../store/useBundleStore';
import { getReviewSections, getTotals } from '../../utils/bundle.utils';

export function useReviewPanel() {
  const selections = useBundleStore((state) => state.selections);
  const markSaved = useBundleStore((state) => state.markSaved);
  const lastSavedAt = useBundleStore((state) => state.lastSavedAt);
  const [checkedOut, setCheckedOut] = useState(false);

  const sections = getReviewSections(bundleData, selections);
  const totals = getTotals(bundleData, selections);

  const handleSave = () => {
    markSaved();
  };

  const handleCheckout = () => {
    setCheckedOut(true);
  };

  return {
    sections,
    totals,
    shipping: bundleData.shipping,
    guarantee: bundleData.guarantee,
    isSaved: lastSavedAt !== null,
    handleSave,
    checkedOut,
    handleCheckout,
  };
}
