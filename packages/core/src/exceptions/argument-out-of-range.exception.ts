import { Exception } from "../base-classes/exception.base";
import { Exceptions } from "../constants/exception.constant";

export class ArgumentOutOfRangeException extends Exception {
  readonly name = Exceptions.argumentOutOfRange;
}
