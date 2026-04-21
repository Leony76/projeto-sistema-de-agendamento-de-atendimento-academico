export const APPOITMENT_FILTER_MAP = [
  { value: 'mostRecent' , label: 'Mais recentes' },
  { value: 'mostOld'    , label: 'Mais antigos'  },
] as const;

export type AppoitmentFilterMapValue = typeof APPOITMENT_FILTER_MAP[number]['value'];