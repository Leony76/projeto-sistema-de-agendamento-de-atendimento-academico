export type LoginUser = {
  email    : string;
  password : string;
};

export type LoginStudent = {
  ra       : string;
  password : string;
  role     : 'STUDENT';
};

export type LoginProfessorOrManager = LoginUser & { role: 'PROFESSOR/MANAGER' };
