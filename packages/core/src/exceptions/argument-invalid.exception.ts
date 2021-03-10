import { Exception } from "../base-classes/exception.base";
import { Exceptions } from "../constants/exception.constant";

export class ArgumentInvalidException extends Exception {
  readonly name = Exceptions.argumentInvalid;
}
