export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return date.toISOString(); 
  }
};