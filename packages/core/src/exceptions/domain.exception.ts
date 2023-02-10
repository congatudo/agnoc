import { Exception } from '../base-classes/exception.base';
import { Exceptions } from '../constants/exception.constant';

export class DomainException extends Exception {
  readonly name = Exceptions.domain;
}
