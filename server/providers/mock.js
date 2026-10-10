// ---------------------------------------------------------------------------
// Mock AI provider. Deterministic, credential-free, and always available.
// It produces structured, plausible output derived from the user's input so
// the app is fully functional out of the box. It NEVER fabricates real market
// prices or claims verified compatibility.
// ---------------------------------------------------------------------------

const THEME_DIRECTIONS = {
  'OEM+': ['Factory-correct wheels in a staggered fitment', 'Subtle lip spoiler', 'Smoked turn signals'],
  Sporty: ['Front lip + side skirts', 'Mild drop on quality springs', 'Darker wheel finish'],
  JDM: ['Bronze or gunmetal wheels', 'Functional front lip', 'Modest ducktail spoiler'],
  Racing: ['Front splitter and canards', 'GT wing sized to the body', 'Lightweight track wheels'],
  Luxury: ['Chrome-delete trim', 'Larger diameter wheels', 'Satin or pearl finish'],
  Elegant: ['Flowing body-color accents', 'Clean grille treatment', 'Flush, understated fitment'],
  Aggressive: ['Widebody or fender flares', 'Deep front bumper', 'Blacked-out accents'],
  Retro: ['Period-style wheels', 'Classic stripe livery', 'Warm paint tone'],
  Futuristic: ['LED light signatures', 'Sharp aero surfacing', 'Monochrome palette'],
  Classic: ['Timeless wheel design', 'Restrained aero', 'Balanced ride height'],
  'Off-Road': ['Raised ride height', 'All-terrain tires', 'Protective bumpers and skid feel'],
  Stance: ['Aggressive fitment', 'Lowered on coilovers or air', 'Negative camber up front'],
};

function pick(arr, n) {
  return arr.slice(0, n);
}

function vehicleLabel(v) {
  return [v.year, v.make, v.model].filter(Boolean).join(' ').trim();
}

export const mockProvider = {
  name: 'mock',

  async analyzeVehicle({ vehicle, hasImage, theme }) {
    const label = vehicleLabel(vehicle);
    const hasEnoughInfo = Boolean(vehicle.make || vehicle.model);
    const confidence = hasImage ? (hasEnoughInfo ? 0.82 : 0.55) : hasEnoughInfo ? 0.7 : 0.25;

    const characteristics = [];
    if (vehicle.bodyStyle) characteristics.push(`Body style: ${vehicle.bodyStyle} (from your input).`);
    if (vehicle.vehicleType) characteristics.push(`Vehicle type: ${vehicle.vehicleType} (from your input).`);
    characteristics.push(
      hasImage
        ? 'Visual estimate: proportions, stance, and lighting suggest a modern production vehicle.'
        : 'No photo provided — observations are based on the written details you supplied.',
    );

    const existing = (vehicle.currentModifications || '')
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const primary = theme?.primary;
    const directions = primary && THEME_DIRECTIONS[primary]
      ? THEME_DIRECTIONS[primary]
      : ['Define a primary theme to unlock tailored styling directions.'];

    return {
      identification: hasEnoughInfo ? label || 'Vehicle (details provided)' : 'Unidentified vehicle',
      confidence,
      bodyStyle: vehicle.bodyStyle || (hasImage ? 'Estimated from photo' : 'Not specified'),
      characteristics,
      existingMods: existing.length ? existing : ['No existing modifications noted.'],
      recommendedDirections: directions,
      compatibility: [
        'Confirm wheel offset and width against your specific chassis before purchase.',
        'Aftermarket aero fitment varies by trim and model year.',
      ],
      constraints: [
        hasImage
          ? 'Image-based identification is an estimate, not a verified specification.'
          : 'Without a photo, the AI cannot assess your vehicle’s current visual state.',
        'Regional road-legality rules may restrict tint, ride height, and fitment.',
      ],
      needsUserInput: !hasEnoughInfo,
      notes: hasEnoughInfo
        ? 'Visual estimates are clearly separated from the specifications you provided.'
        : 'Please provide the make and model so recommendations can be tailored accurately.',
    };
  },

  async recommend({ vehicle, theme, preferences }) {
    const primary = theme?.primary || 'Sporty';
    const dirs = THEME_DIRECTIONS[primary] || THEME_DIRECTIONS.Sporty;
    const use = preferences?.intendedUse || 'Street';
    const label = vehicleLabel(vehicle) || 'your vehicle';

    const exterior = pick(dirs, 3).map((d, i) => ({
      category: 'Exterior',
      title: d,
      rationale: `Reinforces the ${primary} direction for ${label} while suiting ${use} use.`,
      priority: i === 0 ? 'Essential' : i === 1 ? 'Recommended' : 'Optional',
      costEstimate: null,
      safetyNote: /splitter|wing|widebody/i.test(d)
        ? 'Verify mounting points and ground clearance; aggressive aero can affect usability.'
        : undefined,
    }));

    const wheelsSuspension = [
      {
        category: 'Wheels',
        title: `${primary === 'JDM' ? 'Bronze' : 'Gunmetal'} wheels, staggered fitment`,
        rationale: `A finish that complements the ${primary} theme without clashing with the paint.`,
        priority: 'Essential',
        costEstimate: null,
      },
      {
        category: 'Suspension',
        title: use === 'Track' ? 'Coilovers (adjustable)' : 'Quality lowering springs',
        rationale: `Balances stance and ${use === 'Track' ? 'handling precision' : 'daily comfort'}.`,
        priority: 'Recommended',
        costEstimate: null,
        safetyNote: 'Confirm alignment after any ride-height change to protect tire life and braking.',
      },
      {
        category: 'Tires',
        title: 'Performance all-season or summer tires',
        rationale: 'Matches the intended use and keeps the setup road-usable.',
        priority: 'Optional',
        costEstimate: null,
      },
    ];

    return {
      summary: `A ${primary.toLowerCase()} direction for ${label}, tuned for ${use.toLowerCase()} use. Priorities below move from essential character-defining changes to optional refinements.`,
      exterior,
      wheelsSuspension,
      colorPalette: [
        { name: 'Primary body', hex: '#eef0ee', role: 'Dominant surface color' },
        { name: 'Accent', hex: '#c6ff00', role: 'Small highlights (calipers, badges)' },
        { name: 'Hardware', hex: '#4b4f55', role: 'Wheels and trim' },
      ],
      stylingCombinations: [
        `${primary} body + darker wheels + subtle accents keeps the look cohesive.`,
        'Match caliper color to one accent, not several, to avoid visual noise.',
        'Keep aero proportional to the body to preserve recognizable identity.',
      ],
      pricingDisclaimer:
        'No reliable regional pricing data is configured, so exact prices are intentionally omitted. Budget is used only to prioritize suggestions. Always get local quotes.',
    };
  },

  async explain({ vehicle, theme, exterior, wheels, preferences }) {
    const primary = theme?.primary || 'Sporty';
    const label = vehicleLabel(vehicle) || 'the vehicle';
    const paint = exterior?.paintColor || 'the chosen color';
    const use = preferences?.intendedUse || 'Street';
    return {
      philosophy: `The concept pursues a ${primary.toLowerCase()} identity for ${label}, prioritizing a cohesive look over a collection of unrelated parts. Every choice supports a single, legible story.`,
      visualIdentity: `${primary} styling reads instantly through stance, surfacing, and restrained accenting, while keeping the original body proportions recognizable.`,
      colorPalette: `${paint}${exterior?.paintFinish ? ` in a ${exterior.paintFinish.toLowerCase()} finish` : ''} anchors the palette, with hardware kept darker so the body shape stays the focus.`,
      bodyStyling: `Aero and body elements are scaled to the car${exterior?.frontLip ? `, including a ${exterior.frontLip.toLowerCase()} front lip` : ''}, avoiding anything that overwhelms the design.`,
      wheelsSuspension: `${wheels?.wheelFinish || 'Darker'} wheels${wheels?.wheelDiameter ? ` at ${wheels.wheelDiameter}` : ''} with a ${wheels?.rideHeight?.toLowerCase() || 'mild'} ride height give a dialed-in stance appropriate for ${use.toLowerCase()} use.`,
      balanceProportions: 'Visual weight is kept low and even, with fitment that fills the arches without excessive poke, preserving a planted, intentional look.',
      visualImpact: `The result should feel purposeful and premium — a clear ${primary.toLowerCase()} statement that still looks like a refined version of the original car.`,
      practicalConsiderations: `Confirm fitment, alignment, and local legality before committing. Choices were tuned toward ${use.toLowerCase()} usability; more aggressive setups trade comfort and clearance for looks.`,
    };
  },

  async generateImage({ brief }) {
    // The mock provider cannot create pixels. It returns a null image so the
    // front-end renders its configuration-based fallback concept honestly.
    return {
      imageUrl: null,
      isFallback: true,
      note: 'Mock mode: no image-generation provider is configured, so this is a configuration-based concept with placeholder styling rather than an AI-rendered image. Add provider credentials in .env to enable real image generation.',
      prompt: brief,
    };
  },
};
