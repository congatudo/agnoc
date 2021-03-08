import { Exception } from "../base-classes/exception.base";
import { Exceptions } from "../constants/exception.constant";

export class ArgumentNotProvidedException extends Exception {
  readonly name = Exceptions.argumentNotProvided;
}
