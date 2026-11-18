/**
 * Server-side Highlights & Spec Formatter Engine
 * Extracts standardized specs from raw spec tables for cards, teasers and highlights
 */

export interface HighlightItem {
  label: string;
  value: string;
}

export function extractHighlights(specTables: any): HighlightItem[] {
  if (!specTables || !Array.isArray(specTables) || specTables.length === 0) {
    return [];
  }

  const highlights: HighlightItem[] = [];
  const primaryTable = specTables[0];
  if (!primaryTable || !primaryTable.rows || !Array.isArray(primaryTable.rows)) {
    return [];
  }

  // Common spec keys to prioritize
  const desiredKeys = [
    { target: 'Capacity', patterns: ['capacity', 'load capacity', 'rated load'] },
    { target: 'Platform / Table', patterns: ['platform size', 'table size', 'platform dimension', 'table dimension', 'basket size'] },
    { target: 'Lift / Height', patterns: ['raised ht', 'lift height', 'lifting height', 'max height', 'height'] },
    { target: 'Power', patterns: ['power source', 'power', 'motor', 'battery'] }
  ];

  for (const { target, patterns } of desiredKeys) {
    const matchedRow = primaryTable.rows.find((r: any) => {
      const lbl = (r.label || '').toLowerCase();
      return patterns.some((p) => lbl.includes(p));
    });

    if (matchedRow && matchedRow.values && matchedRow.values.length > 0) {
      // Find valid value
      const rawVal = matchedRow.values.find((v: string) => v && v.trim() && v.trim() !== '-');
      if (rawVal) {
        // Clean any residual notes or brackets
        const cleanVal = rawVal.replace(/\(Note:[^)]*\)/gi, '').trim();
        highlights.push({
          label: target,
          value: cleanVal
        });
      }
    }
    if (highlights.length >= 3) break;
  }

  return highlights;
}
