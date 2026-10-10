import { Info } from 'lucide-react';
import { StepShell } from './StepShell';
import { VehicleUploader } from '../upload/VehicleUploader';
import { SuccessBadge } from '../ui/states';
import { useConfig } from '../../state/ConfigContext';

export function PhotoStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { state } = useConfig();
  const hasImage = Boolean(state.image);

  return (
    <StepShell
      title="Vehicle Photo"
      description="Upload a clear photo of your vehicle. A side or three-quarter angle in good light gives the best AI results. Your original image is always preserved for reference."
      badge={hasImage ? <SuccessBadge text="Uploaded" /> : undefined}
      onBack={onBack}
      onNext={onNext}
      nextLabel={hasImage ? 'Continue' : 'Skip for now'}
    >
      <VehicleUploader />

      <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-gray-400">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-lime-glow/70" />
        <p>
          A photo is optional but strongly recommended — it lets the AI analyze your actual vehicle
          and preserve its proportions and scene when generating a concept. Without one, the app
          still works using your written vehicle details and a placeholder preview.
        </p>
      </div>
    </StepShell>
  );
}
