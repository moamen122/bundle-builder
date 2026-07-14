import { bundleData, useBundleStore } from '../../store/useBundleStore';

export function useBundleBuilder() {
  const openStepId = useBundleStore((state) => state.openStepId);
  const setOpenStep = useBundleStore((state) => state.setOpenStep);

  const steps = [...bundleData.steps].sort((a, b) => a.order - b.order);

  const handleValueChange = (value: string[]) => {
    setOpenStep(value[value.length - 1] ?? '');
  };

  return { steps, openStepId, handleValueChange };
}
