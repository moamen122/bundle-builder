import { Camera, Grid3x3, Radio, Shield } from 'lucide-react';
import type { StepIcon } from '../../bundle-builder.types';

export const STEP_ICON_MAP: Record<StepIcon, typeof Camera> = {
  camera: Camera,
  shield: Shield,
  sensor: Radio,
  grid: Grid3x3,
};
