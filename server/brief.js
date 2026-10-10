// Builds a structured, human-readable design brief from the configuration.
// This brief is used as the image-generation prompt and shown to the user.

export function buildBrief({ vehicle, theme, exterior, wheels, preferences, refinement }) {
  const label = [vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(' ') || 'the vehicle';
  const themes = [theme?.primary, ...(theme?.secondary || [])].filter(Boolean).join(' with ');

  const parts = [];
  parts.push(`Modified ${label} in a ${themes || 'tasteful'} styling direction.`);

  const ext = [];
  if (exterior?.paintColor) ext.push(`${exterior.paintFinish ? exterior.paintFinish + ' ' : ''}${exterior.paintColor} paint`);
  if (exterior?.bodyWrap) ext.push(`${exterior.bodyWrap} wrap`);
  if (exterior?.frontBumper && exterior.frontBumper !== 'Stock') ext.push(`${exterior.frontBumper} front bumper`);
  if (exterior?.frontLip && exterior.frontLip !== 'None') ext.push(`${exterior.frontLip} front lip`);
  if (exterior?.sideSkirts && exterior.sideSkirts !== 'Stock') ext.push(`${exterior.sideSkirts} side skirts`);
  if (exterior?.widebody && exterior.widebody !== 'None') ext.push(exterior.widebody.toLowerCase());
  if (exterior?.spoiler && exterior.spoiler !== 'None') ext.push(exterior.spoiler.toLowerCase());
  if (exterior?.hood && exterior.hood !== 'Stock') ext.push(`${exterior.hood} hood`);
  if (exterior?.carbonAccents?.length) ext.push(`carbon-fiber ${exterior.carbonAccents.join(', ').toLowerCase()}`);
  if (exterior?.windowTint && exterior.windowTint !== 'None') ext.push(`${exterior.windowTint} window tint`);
  if (ext.length) parts.push(`Exterior: ${ext.join(', ')}.`);

  const w = [];
  if (wheels?.wheelDiameter) w.push(`${wheels.wheelDiameter} wheels`);
  if (wheels?.wheelFinish) w.push(`${wheels.wheelFinish.toLowerCase()} finish`);
  if (wheels?.wheelDesign) w.push(`${wheels.wheelDesign.toLowerCase()} design`);
  if (wheels?.rideHeight && wheels.rideHeight !== 'Stock') w.push(`${wheels.rideHeight.toLowerCase()} ride height`);
  if (wheels?.suspensionType && wheels.suspensionType !== 'Factory') w.push(wheels.suspensionType.toLowerCase());
  if (wheels?.caliperColor) w.push(`${wheels.caliperColor.toLowerCase()} brake calipers`);
  if (w.length) parts.push(`Wheels & stance: ${w.join(', ')}.`);

  if (preferences?.customRequest) parts.push(`User request: ${preferences.customRequest}`);
  if (preferences?.mustKeep) parts.push(`Must keep: ${preferences.mustKeep}.`);
  if (preferences?.avoid) parts.push(`Avoid: ${preferences.avoid}.`);
  if (preferences?.intendedUse) parts.push(`Intended use: ${preferences.intendedUse}.`);

  parts.push(
    'Preserve the original vehicle identity, body proportions, camera angle, and scene. Photorealistic automotive photography, cinematic lighting.',
  );

  if (refinement) parts.push(`Refinement: ${refinement}.`);

  return parts.join(' ');
}
