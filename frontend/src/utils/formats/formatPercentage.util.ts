export const formatPercentage = (value:number): string => {
  const normalizedValue = (value * 100).toFixed(1).replace('.', ',');

  return normalizedValue + '%';
}