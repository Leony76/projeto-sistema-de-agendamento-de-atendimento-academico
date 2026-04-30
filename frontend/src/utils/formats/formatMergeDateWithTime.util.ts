export const formatMergeDateWithTime = (date: string, hours: string ) => {
  const [year, month, day] = date.split('T')[0].split('-');
  const [hour, minute] = hours.split(':');

  const refinedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );

  return refinedDate.toISOString();
}
