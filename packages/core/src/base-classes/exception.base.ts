import { Exceptions } from '../constants/exception.constant';
import { ObjectLiteral } from '../types/object-literal.type';

export interface SerializedException {
  name: string;
  message: string;
  stack?: string;
  metadata?: ObjectLiteral;
}

export abstract class Exception extends Error {
  override readonly message: string;
  readonly metadata?: ObjectLiteral;

  constructor(message: string, metadata?: ObjectLiteral) {
    super(message);
    this.message = message;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }

  abstract override name: Exceptions;

  toJSON(): SerializedException {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      metadata: this.metadata,
    };
  }
}
