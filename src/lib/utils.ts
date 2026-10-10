export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ACCEPTED_IMAGE_TYPES = ACCEPTED;
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12 MB

export function validateImageFile(file: File): string | null {
  const type = file.type.toLowerCase();
  const okType = ACCEPTED.includes(type) || /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!okType) return 'Unsupported format. Use JPG, JPEG, PNG, or WebP.';
  if (file.size > MAX_IMAGE_BYTES) return 'Image is too large (max 12 MB).';
  return null;
}

export function readImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}
