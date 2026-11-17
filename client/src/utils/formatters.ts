/**
 * Parses raw product code strings into individual model codes without splitting inside single codes
 * (e.g. "LRSTW-0.3T-6.0/9.0/11.0M / LRSTW-0.5T-6.0/9.0/11.0M" -> ["LRSTW-0.3T-6.0/9.0/11.0M", "LRSTW-0.5T-6.0/9.0/11.0M"])
 */
export function parseModelCodes(codeStr: string | null | undefined): string[] {
  if (!codeStr || !codeStr.trim()) return [];

  // If already array or serialized
  if (codeStr.startsWith('[') && codeStr.endsWith(']')) {
    try {
      const parsed = JSON.parse(codeStr);
      if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.trim()).filter(Boolean);
    } catch (e) {}
  }

  // Model codes are separated by spaces around slashes: " / "
  // An internal slash without spaces (e.g. "6.0/9.0/11.0M") is part of the same model code.
  return codeStr
    .split(/\s+\/\s+/)
    .map((c) => c.trim())
    .filter(Boolean);
}

/**
 * Normalizes numbers and raw units to lowercase SI (kg, mm, ton)
 */
export function formatSpecValue(val: string | null | undefined, labelHint = ''): string {
  if (!val || val.trim() === '' || val.trim() === '—') return '—';

  let s = val.trim();

  // If bare number and label indicates height or dimension, display mm
  const isDimension =
    /HEIGHT|RAISED|CLOSED|PLATFORM|TABLE SIZE|DIMENSION/i.test(labelHint);
  const isWeight = /CAPACITY|LOAD/i.test(labelHint);

  if (/^\d+(\.\d+)?$/.test(s)) {
    if (isDimension) s = `${s} mm`;
    else if (isWeight) s = `${s} kg`;
  }

  // Normalize units to lowercase SI
  s = s
    .replace(/\bMM\b/gi, 'mm')
    .replace(/\bKGS\b/gi, 'kg')
    .replace(/\bKG\b/gi, 'kg')
    .replace(/\bTONS\b/gi, 'ton')
    .replace(/\bTON\b/gi, 'ton')
    .replace(/\s*-\s*/g, ' – ') // en-dash
    .replace(/\s*X\s*/gi, ' × ');

  return s;
}
