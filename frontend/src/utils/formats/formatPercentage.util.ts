export const formatPercentage = (value:number): string => {
  const normalizedValue = value * 100;

  return normalizedValue + '%';
}