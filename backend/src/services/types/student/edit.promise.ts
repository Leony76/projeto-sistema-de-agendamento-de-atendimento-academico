export type EditPromise = {
  error: string;
  success?: undefined;
  newData?: undefined;
} | {
  success: string;
  newData: {
    name: string;
    email: string | null;
  };
  error?: undefined;
}