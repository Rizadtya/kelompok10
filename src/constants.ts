import type { ModificationTheme, StepId } from './types';
import {
  Sparkles,
  Camera,
  Car,
  Palette,
  Layers,
  Disc3,
  PencilRuler,
  ScanSearch,
  ListChecks,
  BookOpenText,
  type LucideIcon,
} from 'lucide-react';

export interface StepMeta {
  id: StepId;
  label: string;
  short: string;
  icon: LucideIcon;
  tooltip: string;
  /** Steps that form the guided workflow (welcome excluded from the numbered flow). */
  inFlow: boolean;
}

export const STEPS: StepMeta[] = [
  {
    id: 'welcome',
    label: 'Welcome to Automotive AI',
    short: 'Welcome',
    icon: Sparkles,
    tooltip: 'Project overview and getting started',
    inFlow: false,
  },
  {
    id: 'photo',
    label: 'Vehicle Photo',
    short: 'Photo',
    icon: Camera,
    tooltip: 'Upload a photo of your vehicle',
    inFlow: true,
  },
  {
    id: 'info',
    label: 'Vehicle Information',
    short: 'Info',
    icon: Car,
    tooltip: 'Make, model, year, and specs',
    inFlow: true,
  },
  {
    id: 'theme',
    label: 'Modification Theme',
    short: 'Theme',
    icon: Palette,
    tooltip: 'Choose your overall styling direction',
    inFlow: true,
  },
  {
    id: 'exterior',
    label: 'Exterior Preferences',
    short: 'Exterior',
    icon: Layers,
    tooltip: 'Body kit, paint, aero, and accents',
    inFlow: true,
  },
  {
    id: 'wheels',
    label: 'Wheels and Suspension',
    short: 'Wheels',
    icon: Disc3,
    tooltip: 'Wheels, tires, suspension, and fitment',
    inFlow: true,
  },
  {
    id: 'custom',
    label: 'Custom Requests and Details',
    short: 'Custom',
    icon: PencilRuler,
    tooltip: 'Describe your vision and constraints',
    inFlow: true,
  },
  {
    id: 'analysis',
    label: 'Vehicle Analysis',
    short: 'Analysis',
    icon: ScanSearch,
    tooltip: 'AI analysis of your vehicle',
    inFlow: true,
  },
  {
    id: 'recommendations',
    label: 'Modification Recommendations',
    short: 'Recommend',
    icon: ListChecks,
    tooltip: 'Personalized AI recommendations',
    inFlow: true,
  },
  {
    id: 'explanation',
    label: 'Design Explanation',
    short: 'Explain',
    icon: BookOpenText,
    tooltip: 'Structured explanation of the concept',
    inFlow: true,
  },
];

export const FLOW_STEPS = STEPS.filter((s) => s.inFlow).map((s) => s.id);

export interface ThemeMeta {
  id: ModificationTheme;
  description: string;
  accent: string; // tailwind gradient classes for the example card
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'OEM+',
    description: 'Factory-correct look with subtle, tasteful upgrades. Clean and understated.',
    accent: 'from-slate-500/30 to-slate-800/30',
  },
  {
    id: 'Sporty',
    description: 'Athletic stance, aero hints, and performance-oriented styling cues.',
    accent: 'from-red-500/25 to-charcoal-800/40',
  },
  {
    id: 'JDM',
    description: 'Japanese tuner culture: bronze wheels, functional aero, street presence.',
    accent: 'from-rose-500/25 to-indigo-900/30',
  },
  {
    id: 'Racing',
    description: 'Track-focused: aggressive aero, livery, and purposeful hardware.',
    accent: 'from-amber-400/25 to-charcoal-800/40',
  },
  {
    id: 'Luxury',
    description: 'Refined materials, polished finishes, and premium proportions.',
    accent: 'from-yellow-600/25 to-charcoal-800/40',
  },
  {
    id: 'Elegant',
    description: 'Minimal, flowing lines with restrained detailing and depth.',
    accent: 'from-emerald-500/20 to-charcoal-800/40',
  },
  {
    id: 'Aggressive',
    description: 'Bold angles, wide stance, and a dominant road presence.',
    accent: 'from-orange-600/30 to-charcoal-800/40',
  },
  {
    id: 'Retro',
    description: 'Period-correct cues reinterpreted with modern cleanliness.',
    accent: 'from-amber-700/25 to-charcoal-800/40',
  },
  {
    id: 'Futuristic',
    description: 'Sharp surfacing, LED signatures, and concept-car language.',
    accent: 'from-cyan-500/25 to-charcoal-800/40',
  },
  {
    id: 'Classic',
    description: 'Timeless, balanced styling that respects the original design.',
    accent: 'from-stone-500/25 to-charcoal-800/40',
  },
  {
    id: 'Off-Road',
    description: 'Raised stance, rugged protection, and all-terrain capability.',
    accent: 'from-lime-700/25 to-charcoal-800/40',
  },
  {
    id: 'Stance',
    description: 'Aggressive fitment, flush wheels, and a lowered, dialed-in look.',
    accent: 'from-fuchsia-500/25 to-charcoal-800/40',
  },
];

export const VEHICLE_TYPES = [
  'Coupe',
  'Sedan',
  'Hatchback',
  'SUV',
  'Crossover',
  'Truck',
  'Convertible',
  'Wagon',
  'Van',
  'Supercar',
];

export const BODY_STYLES = [
  '2-door Coupe',
  '4-door Sedan',
  '3-door Hatch',
  '5-door Hatch',
  'Liftback',
  'Fastback',
  'Roadster',
  'Targa',
  'Pickup',
  'Estate',
];

export const CONDITIONS = ['Stock', 'Lightly modified', 'Modified', 'Heavily modified', 'Project car', 'Show car'];

export const POPULAR_MAKES = [
  'Toyota',
  'Honda',
  'Nissan',
  'Mazda',
  'Subaru',
  'Mitsubishi',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Porsche',
  'Ford',
  'Chevrolet',
  'Dodge',
  'Hyundai',
  'Kia',
  'Lexus',
  'Tesla',
];

export const PAINT_SWATCHES = [
  { name: 'Pearl White', hex: '#eef0ee' },
  { name: 'Nardo Gray', hex: '#8b8d8f' },
  { name: 'Jet Black', hex: '#111214' },
  { name: 'Lime Flash', hex: '#c6ff00' },
  { name: 'Racing Red', hex: '#d81e2c' },
  { name: 'Electric Blue', hex: '#1d6cf2' },
  { name: 'Bronze', hex: '#8c6a3f' },
  { name: 'British Racing Green', hex: '#1f3d2b' },
  { name: 'Sunset Orange', hex: '#f05a28' },
  { name: 'Deep Purple', hex: '#5b2a86' },
  { name: 'Champagne', hex: '#cbb892' },
  { name: 'Gunmetal', hex: '#4b4f55' },
];

export const PAINT_FINISHES = ['Gloss', 'Satin', 'Matte', 'Metallic', 'Pearlescent', 'Chrome delete', 'Chameleon'];

export const CALIPER_COLORS = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Red', hex: '#d81e2c' },
  { name: 'Lime', hex: '#c6ff00' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Blue', hex: '#1d6cf2' },
  { name: 'Silver', hex: '#c7c9cc' },
];

export const CARBON_PARTS = ['Hood', 'Roof', 'Mirrors', 'Spoiler', 'Diffuser', 'Front lip', 'Trunk'];

export const WHEEL_PRESETS: Record<
  string,
  {
    label: string;
    description: string;
    values: Partial<{
      wheelDiameter: string;
      tireProfile: string;
      suspensionType: string;
      rideHeight: string;
      fitment: string;
      camber: string;
    }>;
  }
> = {
  oem: {
    label: 'OEM Fitment',
    description: 'Factory-style sizing, comfortable ride, full road legality.',
    values: {
      wheelDiameter: '18"',
      tireProfile: 'Standard',
      suspensionType: 'Factory',
      rideHeight: 'Stock',
      fitment: 'Flush (conservative)',
      camber: 'Factory',
    },
  },
  street: {
    label: 'Street Sport',
    description: 'Mild drop, sharper response, daily-usable.',
    values: {
      wheelDiameter: '19"',
      tireProfile: 'Lowered profile',
      suspensionType: 'Lowering springs',
      rideHeight: 'Mild drop',
      fitment: 'Flush',
      camber: 'Mild negative',
    },
  },
  track: {
    label: 'Track Setup',
    description: 'Stiff, functional, grip-focused. Prioritizes handling over comfort.',
    values: {
      wheelDiameter: '18"',
      tireProfile: 'Semi-slick',
      suspensionType: 'Coilovers',
      rideHeight: 'Low',
      fitment: 'Square / functional',
      camber: 'Aggressive negative',
    },
  },
  show: {
    label: 'Show Car',
    description: 'Maximum visual impact, aggressive stance. Not optimized for daily use.',
    values: {
      wheelDiameter: '20"',
      tireProfile: 'Stretched',
      suspensionType: 'Air suspension',
      rideHeight: 'Slammed',
      fitment: 'Aggressive (poke)',
      camber: 'Heavy negative',
    },
  },
};

export const WHEEL_DIAMETERS = ['16"', '17"', '18"', '19"', '20"', '21"', '22"'];
export const WHEEL_FINISHES = ['Matte Black', 'Gloss Black', 'Bronze', 'Gunmetal', 'Silver', 'Polished', 'Gold', 'White', 'Lime'];
export const SUSPENSION_TYPES = ['Factory', 'Lowering springs', 'Coilovers', 'Air suspension', 'Lift kit'];
export const FITMENTS = ['Flush (conservative)', 'Flush', 'Square / functional', 'Aggressive (poke)', 'Stretched'];

export const INTENDED_USES: { id: import('./types').IntendedUse; description: string }[] = [
  { id: 'Daily', description: 'Comfort and practicality for everyday driving.' },
  { id: 'Street', description: 'Balanced street presence with usable performance.' },
  { id: 'Track', description: 'Handling and grip prioritized over comfort.' },
  { id: 'Show', description: 'Maximum visual impact for display.' },
  { id: 'Off-Road', description: 'Capability and durability on rough terrain.' },
];
