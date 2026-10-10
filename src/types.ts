// ---------------------------------------------------------------------------
// Core data model for the Automotive AI Visualizer.
// A single `CustomizationState` object captures the entire session.
// ---------------------------------------------------------------------------

export type StepId =
  | 'welcome'
  | 'photo'
  | 'info'
  | 'theme'
  | 'exterior'
  | 'wheels'
  | 'custom'
  | 'analysis'
  | 'recommendations'
  | 'explanation';

export type ModificationTheme =
  | 'OEM+'
  | 'Sporty'
  | 'JDM'
  | 'Racing'
  | 'Luxury'
  | 'Elegant'
  | 'Aggressive'
  | 'Retro'
  | 'Futuristic'
  | 'Classic'
  | 'Off-Road'
  | 'Stance';

export type IntendedUse = 'Daily' | 'Street' | 'Track' | 'Show' | 'Off-Road';

export type Priority = 'Essential' | 'Recommended' | 'Optional';

export interface UploadedImage {
  /** Object URL or data URL for preview. */
  dataUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  vehicleType: string;
  bodyStyle: string;
  condition: string;
  currentModifications: string;
  engineDetails: string;
}

export interface ThemeSelection {
  primary: ModificationTheme | '';
  secondary: ModificationTheme[];
}

export interface ExteriorPreferences {
  frontBumper: string;
  rearBumper: string;
  frontLip: string;
  rearDiffuser: string;
  sideSkirts: string;
  hood: string;
  grille: string;
  headlights: string;
  taillights: string;
  widebody: string;
  spoiler: string;
  paintColor: string; // hex or name
  paintFinish: string;
  bodyWrap: string;
  carbonAccents: string[];
  windowTint: string;
  decals: string;
}

export interface WheelsSuspension {
  preset: string;
  wheelDesign: string;
  wheelDiameter: string;
  wheelFinish: string;
  tireProfile: string;
  suspensionType: string;
  rideHeight: string;
  fitment: string;
  camber: string;
  caliperColor: string;
}

export interface Preferences {
  budgetRange: string;
  intendedUse: IntendedUse;
  complexity: number; // 1-5
  realism: number; // 1-5
  mustKeep: string;
  avoid: string;
  customRequest: string;
}

export interface VehicleAnalysis {
  identification: string;
  confidence: number; // 0-1
  bodyStyle: string;
  characteristics: string[];
  existingMods: string[];
  recommendedDirections: string[];
  compatibility: string[];
  constraints: string[];
  needsUserInput: boolean;
  notes: string;
}

export interface RecommendationItem {
  category: string;
  title: string;
  rationale: string;
  priority: Priority;
  costEstimate: string | null; // null when no reliable data
  safetyNote?: string;
}

export interface Recommendations {
  exterior: RecommendationItem[];
  wheelsSuspension: RecommendationItem[];
  colorPalette: { name: string; hex: string; role: string }[];
  stylingCombinations: string[];
  summary: string;
  pricingDisclaimer: string;
}

export interface DesignExplanation {
  philosophy: string;
  visualIdentity: string;
  colorPalette: string;
  bodyStyling: string;
  wheelsSuspension: string;
  balanceProportions: string;
  visualImpact: string;
  practicalConsiderations: string;
}

export interface GeneratedConcept {
  id: string;
  imageUrl: string | null; // null => fallback/placeholder render
  prompt: string;
  settings: Record<string, string>;
  createdAt: string; // ISO
  isFallback: boolean;
  note?: string;
}

export interface CustomizationState {
  vehicle: VehicleInfo;
  image: UploadedImage | null;
  theme: ThemeSelection;
  exterior: ExteriorPreferences;
  wheels: WheelsSuspension;
  preferences: Preferences;
  analysis: VehicleAnalysis | null;
  recommendations: Recommendations | null;
  explanation: DesignExplanation | null;
  generatedConcepts: GeneratedConcept[];
}

export interface ProviderStatus {
  text: 'mock' | 'openai' | 'custom' | string;
  vision: string;
  image: string;
  configured: boolean;
}
