import { useCallback, useRef, useState } from 'react';
import { UploadCloud, ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import { useConfig } from '../../state/ConfigContext';
import {
  ACCEPTED_IMAGE_TYPES,
  formatBytes,
  readImageDimensions,
  validateImageFile,
} from '../../lib/utils';
import { cn } from '../../lib/utils';

export function VehicleUploader() {
  const { state, setImage } = useConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const reader = new FileReader();
      setProgress(0);
      reader.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const dims = await readImageDimensions(dataUrl);
        setImage({
          dataUrl,
          fileName: file.name,
          mimeType: file.type || 'image/*',
          sizeBytes: file.size,
          width: dims.width,
          height: dims.height,
        });
        setProgress(100);
        window.setTimeout(() => setProgress(null), 500);
      };
      reader.onerror = () => {
        setError('Could not read the file. Please try another image.');
        setProgress(null);
      };
      reader.readAsDataURL(file);
    },
    [setImage],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const image = state.image;

  if (image) {
    return (
      <div className="space-y-4">
        <div className="glass-panel glass-panel-sheen relative overflow-hidden">
          <img
            src={image.dataUrl}
            alt={`Uploaded: ${image.fileName}`}
            className="max-h-[420px] w-full object-contain"
          />
          {progress !== null && progress < 100 && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-charcoal-700">
              <div className="h-full bg-lime-glow transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <ImageIcon className="h-5 w-5 flex-shrink-0 text-lime-glow/70" />
            <div className="min-w-0">
              <p className="truncate text-sm text-gray-200">{image.fileName}</p>
              <p className="text-xs text-gray-500">
                {formatBytes(image.sizeBytes)}
                {image.width ? ` · ${image.width}×${image.height}px` : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={() => inputRef.current?.click()}>
              <RefreshCw className="h-4 w-4" /> Replace
            </button>
            <button
              type="button"
              className="btn-ghost text-red-300 hover:bg-red-500/10 hover:text-red-200"
              onClick={() => setImage(null)}
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        </div>
        <HiddenInput inputRef={inputRef} onFile={handleFile} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-all',
          dragOver
            ? 'border-lime-glow bg-lime-glow/5 shadow-glow-sm'
            : 'border-white/10 bg-white/[0.02] hover:border-lime-glow/40 hover:bg-white/[0.04]',
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-glow/10 text-lime-glow">
          <UploadCloud className="h-8 w-8" />
        </div>
        <div>
          <p className="font-display text-base font-semibold text-white">
            Drop your vehicle photo here
          </p>
          <p className="mt-1 text-sm text-gray-500">or click to browse your files</p>
        </div>
        <p className="text-xs text-gray-600">JPG, JPEG, PNG, or WebP · up to 12 MB</p>

        {progress !== null && (
          <div className="w-full max-w-xs">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-charcoal-700">
              <div className="h-full bg-lime-glow transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">Uploading… {progress}%</p>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <HiddenInput inputRef={inputRef} onFile={handleFile} />
    </div>
  );
}

function HiddenInput({
  inputRef,
  onFile,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  onFile: (f: File) => void;
}) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED_IMAGE_TYPES.join(',')}
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = '';
      }}
    />
  );
}
