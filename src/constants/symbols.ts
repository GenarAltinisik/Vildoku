export const SYMBOLS_9X9 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export const SYMBOLS_16X16 = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G'
] as const;

export type Symbol9x9 = typeof SYMBOLS_9X9[number];
export type Symbol16x16 = typeof SYMBOLS_16X16[number];

/**
 * Converts a symbol string to its decimal integer value.
 * '1'..'9' -> 1..9
 * 'A' -> 10, 'B' -> 11, ..., 'G' -> 16
 */
export function symbolToValue(symbol: string): number {
  if (!symbol) return 0;
  const num = parseInt(symbol, 10);
  if (!isNaN(num)) return num;
  const code = symbol.toUpperCase().charCodeAt(0);
  if (code >= 65 && code <= 71) { // 'A' through 'G'
    return code - 65 + 10;
  }
  return 0;
}

/**
 * Converts an integer value (1..16) back to its display symbol.
 * 1..9 -> '1'..'9'
 * 10 -> 'A', 11 -> 'B', ..., 16 -> 'G'
 */
export function valueToSymbol(value: number): string {
  if (value >= 1 && value <= 9) return String(value);
  if (value >= 10 && value <= 16) {
    return String.fromCharCode(65 + (value - 10)); // 'A' = 65
  }
  return '';
}
