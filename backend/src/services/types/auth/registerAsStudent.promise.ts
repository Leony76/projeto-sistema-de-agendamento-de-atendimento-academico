export type RegisterAsStudentPromise = {
  success: string;
  student: {
      name: string;
      ra: string | null;
  };
  error?: undefined;
} | {
  error: string;
  success?: undefined;
  student?: undefined;
}