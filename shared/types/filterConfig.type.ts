export type FilterConfig<T, FilterValue extends string> = {
  searchFields: ((item: T) => string | undefined | null | boolean)[];

  filters?: Partial<
    Record<FilterValue, (item: T) => boolean>
  >;

  sorts?: Partial<
    Record<FilterValue, (a: T, b: T) => number>
  >;
};