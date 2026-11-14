export const light = {
  background: '#F8F7F3',
  surface: '#FFFFFF',
  secondarySurface: '#E8EFE9',
  accent: '#729A89',
  primary: '#416B59',
  blue: '#DCE8F1',
  lavender: '#EDE4F2',
  peach: '#F3E5D9',
  text: '#293631',
  secondaryText: '#596861',
  border: '#E4E9E3',
  error: '#A94747',
} as const;
export const dark = {
  ...light,
  background: '#171D1B',
  surface: '#232B27',
  secondarySurface: '#34413B',
  primary: '#B4D6BF',
  text: '#F2F5EF',
  secondaryText: '#A9B8AF',
  border: '#46554C',
} as const;
export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48] as const;
export const radii = { card: 20, button: 16, input: 14 };
