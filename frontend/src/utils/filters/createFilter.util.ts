import { type FilterConfig } from '@shared/types/filterConfig.type';

export const createFilter = <T, FilterValue extends string>(
  data        : T[],
  searchValue : string,
  filterValue : FilterValue,
  config      : FilterConfig<T, FilterValue>,
): T[] => {

  const search = searchValue.toLowerCase();

  return data.filter((item) => {
    const matchesSearch = config.searchFields.some((field) => {
      const value = field(item);

      if (value === undefined || value === null) return false;

      return String(value).toLowerCase().includes(search);
    });

    if (!filterValue) 
      return matchesSearch;

    const customFilter = config.filters?.[filterValue];

    if (!customFilter) 
      return matchesSearch;

    return matchesSearch && customFilter(item);

  }).sort((a, b) => {
    if (!filterValue) return 0;

    return config.sorts?.[filterValue]?.(a, b) ?? 0;
  });
};