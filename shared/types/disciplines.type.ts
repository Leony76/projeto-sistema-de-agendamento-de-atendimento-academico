import type { DISCIPLINES_VALUE_MAP } from "@frontend/constants/maps/disciplines.map";

// export type Discipline = keyof typeof DISCIPLINES_VALUE_MAP;
export type Discipline = {
  readonly          id : number;
  readonly professorId : number;
  
  name: string;
};