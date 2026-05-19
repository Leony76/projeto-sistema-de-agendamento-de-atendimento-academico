export type ValidationError = {
  field: string;
  message: string;
};

export class ApiError extends Error {

  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = 400,
    public errors?: ValidationError[],
  ) {
    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}