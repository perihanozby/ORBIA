import { light, dark } from '../src/theme/tokens';
function luminance(hex: string) {
  const rgb = [1, 3, 5]
    .map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map(value =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
test('body, secondary and primary-button text meet 4.5:1 contrast in both themes', () => {
  for (const theme of [light, dark]) {
    for (const surface of [
      theme.background,
      theme.surface,
      theme.secondarySurface,
    ]) {
      expect(contrast(theme.text, surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme.secondaryText, surface)).toBeGreaterThanOrEqual(
        4.5,
      );
    }
    expect(contrast(theme.background, theme.primary)).toBeGreaterThanOrEqual(
      4.5,
    );
  }
});
