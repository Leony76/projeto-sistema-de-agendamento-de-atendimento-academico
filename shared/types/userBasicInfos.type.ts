export type Student = {
  readonly id  : number;
  name         : string;
  photo        : string | null;
  email        : string;
  ra           : string;
  registeredAt : string;
};

export type Professor = {
  readonly id  : number;
  name         : string;
  email        : string;
  photo        : string | null;
  disciplines  : string[]; 
  registeredAt : string;
};

export type Manager = {
  readonly id  : number;
  name         : string;
  photo        : string | null;
  email        : string;
  registeredAt : string;
};