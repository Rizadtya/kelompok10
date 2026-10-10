import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  CustomizationState,
  ExteriorPreferences,
  GeneratedConcept,
  Preferences,
  ThemeSelection,
  VehicleInfo,
  WheelsSuspension,
  DesignExplanation,
  Recommendations,
  VehicleAnalysis,
  UploadedImage,
} from '../types';
import { createDefaultState } from './defaults';

const STORAGE_KEY = 'automotive-ai-visualizer:v1';

interface ConfigContextValue {
  state: CustomizationState;
  updateVehicle: (patch: Partial<VehicleInfo>) => void;
  setImage: (img: UploadedImage | null) => void;
  updateTheme: (patch: Partial<ThemeSelection>) => void;
  updateExterior: (patch: Partial<ExteriorPreferences>) => void;
  updateWheels: (patch: Partial<WheelsSuspension>) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
  setAnalysis: (a: VehicleAnalysis | null) => void;
  setRecommendations: (r: Recommendations | null) => void;
  setExplanation: (e: DesignExplanation | null) => void;
  addConcept: (c: GeneratedConcept) => void;
  removeConcept: (id: string) => void;
  reset: () => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

/** Load persisted state, but never persist the (potentially large) image data URL. */
function loadInitialState(): CustomizationState {
  if (typeof window === 'undefined') return createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<CustomizationState>;
    return { ...createDefaultState(), ...parsed, image: null };
  } catch {
    return createDefaultState();
  }
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CustomizationState>(loadInitialState);
  const saveTimer = useRef<number | null>(null);

  // Persist everything except the heavy image blob (debounced).
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const { image: _image, ...rest } = state;
        void _image;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      } catch {
        /* storage may be full or unavailable — non-fatal */
      }
    }, 400);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state]);

  const updateVehicle = useCallback(
    (patch: Partial<VehicleInfo>) =>
      setState((s) => ({ ...s, vehicle: { ...s.vehicle, ...patch } })),
    [],
  );
  const setImage = useCallback((img: UploadedImage | null) => setState((s) => ({ ...s, image: img })), []);
  const updateTheme = useCallback(
    (patch: Partial<ThemeSelection>) => setState((s) => ({ ...s, theme: { ...s.theme, ...patch } })),
    [],
  );
  const updateExterior = useCallback(
    (patch: Partial<ExteriorPreferences>) =>
      setState((s) => ({ ...s, exterior: { ...s.exterior, ...patch } })),
    [],
  );
  const updateWheels = useCallback(
    (patch: Partial<WheelsSuspension>) => setState((s) => ({ ...s, wheels: { ...s.wheels, ...patch } })),
    [],
  );
  const updatePreferences = useCallback(
    (patch: Partial<Preferences>) =>
      setState((s) => ({ ...s, preferences: { ...s.preferences, ...patch } })),
    [],
  );
  const setAnalysis = useCallback((a: VehicleAnalysis | null) => setState((s) => ({ ...s, analysis: a })), []);
  const setRecommendations = useCallback(
    (r: Recommendations | null) => setState((s) => ({ ...s, recommendations: r })),
    [],
  );
  const setExplanation = useCallback(
    (e: DesignExplanation | null) => setState((s) => ({ ...s, explanation: e })),
    [],
  );
  const addConcept = useCallback(
    (c: GeneratedConcept) => setState((s) => ({ ...s, generatedConcepts: [c, ...s.generatedConcepts] })),
    [],
  );
  const removeConcept = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, generatedConcepts: s.generatedConcepts.filter((c) => c.id !== id) })),
    [],
  );
  const reset = useCallback(() => {
    setState(createDefaultState());
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ConfigContextValue>(
    () => ({
      state,
      updateVehicle,
      setImage,
      updateTheme,
      updateExterior,
      updateWheels,
      updatePreferences,
      setAnalysis,
      setRecommendations,
      setExplanation,
      addConcept,
      removeConcept,
      reset,
    }),
    [
      state,
      updateVehicle,
      setImage,
      updateTheme,
      updateExterior,
      updateWheels,
      updatePreferences,
      setAnalysis,
      setRecommendations,
      setExplanation,
      addConcept,
      removeConcept,
      reset,
    ],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within a ConfigProvider');
  return ctx;
}
