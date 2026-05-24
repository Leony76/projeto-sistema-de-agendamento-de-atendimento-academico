export const createFilterValueMap = <
  T extends readonly { value: string; label: string }[]
>(
  filters: T,
) => {
  return Object.fromEntries(
    filters.map((item) => [item.value, item.label]),
  ) as Record<T[number]['value'], T[number]['label']>;
};