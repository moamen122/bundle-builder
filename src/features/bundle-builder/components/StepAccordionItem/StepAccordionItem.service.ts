import { useBundleStore } from '../../store/useBundleStore';
import { getStepSelectedCount } from '../../utils/bundle.utils';
import type { BundleStep } from '../../bundle-builder.types';

export function useStepAccordionItem(step: BundleStep, nextStep?: BundleStep) {
  const selections = useBundleStore((state) => state.selections);
  const setOpenStep = useBundleStore((state) => state.setOpenStep);

  const selectedCount = getStepSelectedCount(step, selections);

  const goToNextStep = () => {
    if (nextStep) setOpenStep(nextStep.id);
  };

  return { selectedCount, goToNextStep };
}
