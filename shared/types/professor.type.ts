export type Professor = {
  readonly id  : number;
  name         : string;
  email        : string;
  photo        : string | null;
  disciplines  : string[]; 
  registeredAt : string;
};