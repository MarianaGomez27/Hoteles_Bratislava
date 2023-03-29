type ErrorObject = {
  [key: string]: string;
};

export const errors: ErrorObject = {
  ERROR_000: 'Invalid parameter',
  ERROR_001: 'Invalid country or state',
};

export class CustomError extends Error {
  customCode: string;
  constructor(code: string, message?: string) {
    message ? super(message) : super(errors[code]);
    this.customCode = code;
  }
}
