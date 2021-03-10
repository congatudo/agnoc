import { Exceptions } from "../constants/exception.constant";

export interface SerializedException {
  name: string;
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

export abstract class Exception extends Error {
  constructor(
    readonly message: string,
    readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  abstract name: Exceptions;

  toJSON(): SerializedException {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      metadata: this.metadata,
    };
  }
}
