export const CATEGORIES = [
  'JEWELRY',
  'HOME',
  'APPAREL',
  'ART',
  'OTHER',
];

export default CATEGORIES;

export function formatCategory(value?: string | null) {
  if (!value) return '';
  // make 'JEWELRY' -> 'Jewelry'
  return String(value).charAt(0) + String(value).slice(1).toLowerCase();
}

export const CATEGORY_LABELS: Record<string, string> = CATEGORIES.reduce((acc, c) => {
  acc[c] = formatCategory(c);
  return acc;
}, {} as Record<string, string>);
