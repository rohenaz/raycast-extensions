import { Clipboard, getPreferenceValues, showHUD } from "@raycast/api";

interface OutputPreferences {
  copy: boolean;
  insert: boolean;
}

export async function outputGeneratedValue(
  value: string,
  label: string,
  sensitive = false,
): Promise<void> {
  const preferences = getPreferenceValues<OutputPreferences>();

  if (preferences.copy) {
    await Clipboard.copy(value);
  }
  if (preferences.insert) {
    await Clipboard.paste(value);
  }

  const destination = [
    preferences.copy && "copied",
    preferences.insert && "inserted",
  ]
    .filter(Boolean)
    .join(" and ");
  const valueDescription = sensitive ? label : `${label} ${value}`;
  await showHUD(
    destination
      ? `${valueDescription} ${destination}`
      : `${valueDescription} generated`,
  );
}

export async function generateAndOutput(
  generate: () => string,
  label: string,
  sensitive = false,
): Promise<void> {
  try {
    await outputGeneratedValue(generate(), label, sensitive);
  } catch (error) {
    console.error(`Unable to generate ${label}`, error);
    await showHUD(`Unable to generate ${label}`);
  }
}
