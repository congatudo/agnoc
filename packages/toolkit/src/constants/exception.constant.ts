import { ValueOf } from '../types/value-of.type';

export const Exceptions = {
  argumentInvalid: 'ArgumentInvalidException',
  argumentOutOfRange: 'ArgumentOutOfRangeException',
  argumentNotProvided: 'ArgumentNotProvidedException',
  domain: 'DomainException',
  notImplemented: 'NotImplementedException',
  timeout: 'TimeoutException',
} as const;

export type ExceptionName = ValueOf<typeof Exceptions>;
