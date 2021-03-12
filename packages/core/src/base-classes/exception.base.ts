import { Exceptions } from "../constants/exception.constant";
import { ObjectLiteral } from "../types/object-literal.type";

export interface SerializedException {
  name: string;
  message: string;
  stack?: string;
  metadata?: ObjectLiteral;
}

export abstract class Exception extends Error {
  constructor(readonly message: string, readonly metadata?: ObjectLiteral) {
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
