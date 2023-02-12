import type { ObjectLiteral } from '../types/object-literal.type';

export interface SerializedException {
  name: string;
  message: string;
  stack?: string;
  metadata?: ObjectLiteral;
  cause?: SerializedException | unknown;
}

export abstract class Exception extends Error {
  override readonly name = this.constructor.name;
  readonly metadata?: ObjectLiteral;

  constructor(message: string, metadata?: ObjectLiteral, options?: ErrorOptions) {
    super(message, options);
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): SerializedException {
    return {
      name: this.name,
      message: this.message,
      ...(this.stack && { stack: this.stack }),
      ...(this.metadata && { metadata: this.metadata }),
      ...(this.cause ? { cause: serializeError(this.cause) } : {}),
    };
  }
}

function serializeError(error: unknown): SerializedException | unknown | undefined {
  if (!(error instanceof Error)) {
    return error;
  }

  if (error instanceof Exception) {
    return error.toJSON();
  }

  return {
    name: error.name,
    message: error.message,
    ...(error.stack && { stack: error.stack }),
    ...(error.cause ? { cause: serializeError(error.cause) } : {}),
  };
}
