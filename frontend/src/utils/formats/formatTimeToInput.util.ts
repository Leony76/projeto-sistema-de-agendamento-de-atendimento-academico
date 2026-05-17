export const formatTimeInput = (value: string): string => {

  const numbers = value.replace(/\D/g, '');

  const limited = numbers.slice(0, 4);

  if (limited.length <= 2) {
    return limited;
  }

  const hours = limited.slice(0, 2);
  const minutes = limited.slice(2);

  return `${hours}:${minutes}`;
};