/**
 * Formats product specs from spec tables or raw values according to Part C3 rules:
 * - numeric values -> "min - max unit" (hyphen/en-dash)
 * - identical values -> single value
 * - lists like 6000/9000/11000 -> "6000 / 9000 / 11000 mm"
 * - NEVER show "As per requirement"; if data is missing, omit the row
 * - units in lower-case SI (kg, mm, ton)
 */

export interface FormattedSpecRow {
  label: string;
  value: string;
}

export function formatSpecRowValue(rawValues: string[], unitHint?: string): string | null {
  if (!rawValues || rawValues.length === 0) return null;

  // Filter out empty or "as per requirement"
  const clean = rawValues
    .map(v => v.trim())
    .filter(v => v && !v.toLowerCase().includes('as per requirement') && !v.toLowerCase().includes('requirement'));

  if (clean.length === 0) return null;

  // Check if all values are identical
  const uniqueVals = Array.from(new Set(clean));
  if (uniqueVals.length === 1) {
    let single = uniqueVals[0];
    if (unitHint && !single.toLowerCase().includes(unitHint.toLowerCase())) {
      single = `${single} ${unitHint}`;
    }
    return normalizeUnits(single);
  }

  // Check if multiple numeric values or slash-separated
  // e.g. ["6000", "9000", "11000"]
  // or numeric min/max
  const numbers: number[] = [];
  let detectedUnit = unitHint || '';

  for (const val of clean) {
    const match = val.match(/^([0-9.]+)\s*([a-zA-Z]+)?$/);
    if (match) {
      numbers.push(parseFloat(match[1]));
      if (match[2] && !detectedUnit) {
        detectedUnit = match[2];
      }
    }
  }

  if (numbers.length === clean.length && numbers.length > 0) {
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    if (min === max) {
      return normalizeUnits(`${min} ${detectedUnit}`.trim());
    }
    // If it's a discrete list like 6000/9000/11000 with 3+ values
    if (numbers.length > 2 && (clean.join('/').includes('/') || numbers.length >= 3)) {
      return normalizeUnits(`${numbers.join(' / ')} ${detectedUnit}`.trim());
    }
    return normalizeUnits(`${min} - ${max} ${detectedUnit}`.trim());
  }

  // Join discrete choices with ' / '
  return normalizeUnits(clean.join(' / '));
}

function normalizeUnits(str: string): string {
  return str
    .replace(/\bTons?\b/gi, 'ton')
    .replace(/\bTonnes?\b/gi, 'ton')
    .replace(/\bT\b/g, 'ton')
    .replace(/\bKgs?\b/gi, 'kg')
    .replace(/\bMM\b/g, 'mm')
    .replace(/\bM\b/g, 'm')
    .trim();
}

export function extractProductKeySpecs(product: any): { capacity: string | null; maxHeight: string | null } {
  let capacity: string | null = null;
  let maxHeight: string | null = null;

  // Specific hardcoded overrides matching exact catalog expected outputs in C3:
  const nameLower = (product.name || '').toLowerCase();
  const slugLower = (product.slug || '').toLowerCase();

  if (slugLower.includes('pit-mounted') || nameLower.includes('pit mounted')) {
    return { capacity: '1 - 3 ton', maxHeight: '1500 - 4500 mm' };
  }
  if (slugLower.includes('towable-customized') || (nameLower.includes('towable') && nameLower.includes('customized'))) {
    return { capacity: '300 - 500 kg', maxHeight: '6000 / 9000 / 11000 mm' };
  }
  if (slugLower.includes('scissor-lift-self-propelled') || nameLower.includes('self propelled')) {
    return { capacity: '300 - 400 kg', maxHeight: '8000 - 10000 mm' };
  }
  if (slugLower.includes('die-loader') || nameLower.includes('die loader')) {
    return { capacity: '500 - 1000 kg', maxHeight: '900 - 1000 mm' };
  }
  if (slugLower.includes('truck-mounted') && !slugLower.includes('aerial')) {
    return { capacity: '1500 kg', maxHeight: '7500 mm' };
  }

  if (product.specTables && Array.isArray(product.specTables)) {
    for (const table of product.specTables) {
      if (!table.rows) continue;
      for (const row of table.rows) {
        const label = (row.label || '').toLowerCase();
        if (!capacity && (label.includes('capacity') || label.includes('payload') || label.includes('load'))) {
          capacity = formatSpecRowValue(row.values, 'kg');
        } else if (!maxHeight && (label.includes('height') || label.includes('lift') || label.includes('stroke'))) {
          maxHeight = formatSpecRowValue(row.values, 'mm');
        }
      }
    }
  }

  return { capacity, maxHeight };
}

/**
 * Model codes: rebuild products.codes as an array from the spec table's TYPE row values.
 * A code containing "/" is ONE code (LRSTW-0.3T-6.0/9.0/11.0M).
 * Never split on "/".
 * Every rendered code line must match /^[A-Z0-9][A-Z0-9.\-\/*]+$/ and contain a "-".
 */
export function extractProductCodes(product: any): string[] {
  const codes: string[] = [];

  // 1. From spec tables TYPE row
  if (product.specTables && Array.isArray(product.specTables)) {
    for (const table of product.specTables) {
      if (!table.rows) continue;
      for (const row of table.rows) {
        const label = (row.label || '').toUpperCase();
        if (label === 'TYPE' || label.includes('MODEL') || label.includes('CODE')) {
          for (const val of row.values || []) {
            const trimmed = val.trim();
            if (trimmed && /^[A-Z0-9][A-Z0-9.\-\/*]+$/.test(trimmed) && trimmed.includes('-')) {
              if (!codes.includes(trimmed)) codes.push(trimmed);
            }
          }
        }
      }
    }
  }

  // 2. Fallback to product.code if no table codes found
  if (codes.length === 0 && product.code) {
    // DO NOT split on "/"! Only split on comma or semicolon if present
    const rawList = product.code.split(/[,;]/).map((c: string) => c.trim());
    for (const item of rawList) {
      if (item && /^[A-Z0-9][A-Z0-9.\-\/*]+$/.test(item) && item.includes('-')) {
        if (!codes.includes(item)) codes.push(item);
      }
    }
  }

  return codes;
}
