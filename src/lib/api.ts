import type {
  CustomizationState,
  DesignExplanation,
  GeneratedConcept,
  ProviderStatus,
  Recommendations,
  VehicleAnalysis,
} from '../types';

// ---------------------------------------------------------------------------
// Front-end API client. All AI calls are proxied to the server layer, which
// owns provider credentials. The server falls back to a deterministic "mock"
// provider when no credentials are configured, so the app is always functional.
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      'Could not reach the AI server. Start it with `npm run server` (see README).',
      0,
    );
  }
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) detail = data.error;
    } catch {
      /* ignore parse error */
    }
    throw new ApiError(detail, res.status);
  }
  return (await res.json()) as T;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status);
  return (await res.json()) as T;
}

export const api = {
  status: () => get<ProviderStatus>('/api/status'),

  analyze: (state: CustomizationState) =>
    post<{ analysis: VehicleAnalysis }>('/api/analyze', {
      vehicle: state.vehicle,
      hasImage: Boolean(state.image),
      imageMeta: state.image
        ? { fileName: state.image.fileName, width: state.image.width, height: state.image.height }
        : null,
      // Keep payload modest: only send the image when present.
      imageDataUrl: state.image?.dataUrl ?? null,
      theme: state.theme,
    }),

  recommend: (state: CustomizationState) =>
    post<{ recommendations: Recommendations }>('/api/recommend', {
      vehicle: state.vehicle,
      theme: state.theme,
      exterior: state.exterior,
      wheels: state.wheels,
      preferences: state.preferences,
      analysis: state.analysis,
    }),

  explain: (state: CustomizationState) =>
    post<{ explanation: DesignExplanation }>('/api/explain', {
      vehicle: state.vehicle,
      theme: state.theme,
      exterior: state.exterior,
      wheels: state.wheels,
      preferences: state.preferences,
      recommendations: state.recommendations,
    }),

  generate: (state: CustomizationState, refinement?: string) =>
    post<{ concept: GeneratedConcept }>('/api/generate', {
      vehicle: state.vehicle,
      theme: state.theme,
      exterior: state.exterior,
      wheels: state.wheels,
      preferences: state.preferences,
      imageDataUrl: state.image?.dataUrl ?? null,
      refinement: refinement ?? null,
    }),
};
