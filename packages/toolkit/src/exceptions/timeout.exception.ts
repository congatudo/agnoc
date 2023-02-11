import { Exception } from '../base-classes/exception.base';
import { Exceptions } from '../constants/exception.constant';

export class TimeoutException extends Exception {
  readonly name = Exceptions.timeout;
}
