import type { AVAILABLE_HOURS } from "@frontend/constants/availableHours.const";

export type AvailableHours = typeof AVAILABLE_HOURS[number];

export type Hours = {
  start : string; 
  end   : string; 
};
