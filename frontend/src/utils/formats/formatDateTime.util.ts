export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};