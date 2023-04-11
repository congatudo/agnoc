import type { ObjectLiteral } from '../types/object-literal.type';

/** JSON representation of an exception. */
export interface JSONException {
  /** Name of the exception. */
  name: string;
  /** Message of the exception. */
  message: string;
  /** Stack trace of the exception. */
  stack?: string;
  /** Metadata of the exception. */
  metadata?: ObjectLiteral;
  /** Cause of the exception. */
  cause?: JSONException | unknown;
}

/** Base class for building an exception. */
export abstract class Exception extends Error {
  override readonly name = this.constructor.name;
  readonly metadata?: ObjectLiteral;

  constructor(message: string, metadata?: ObjectLiteral, options?: ErrorOptions) {
    super(message, options);
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }

  /** Convert the exception to a JSON object. */
  toJSON(): JSONException {
    return {
      name: this.name,
      message: this.message,
      ...(this.stack && { stack: this.stack }),
      ...(this.metadata && { metadata: this.metadata }),
      ...(this.cause ? { cause: serializeError(this.cause) } : {}),
    };
  }
}

function serializeError(error: unknown): JSONException | unknown | undefined {
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
