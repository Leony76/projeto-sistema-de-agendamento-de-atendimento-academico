export type ShiftHourConfig = {
  key: 'MORNING' | 'AFTERNOON';
  label: string;
  min: number;
  max: number;
  fallbackStart : string;
  fallbackEnd   : string;
}