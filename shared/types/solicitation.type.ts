import { SolicitationStatus } from "./solicitationStatus.type";

export type Solicitation<T> = { 
  readonly id        : number;
  status             : SolicitationStatus;
  reason             : string;
  appoitmentDateTime : string;
  user               : T;
}
