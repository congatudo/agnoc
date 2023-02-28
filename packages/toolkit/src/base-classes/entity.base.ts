import { ID } from '../domain-primitives/id.domain-primitive';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { convertPropsToObject } from '../utils/convert-props-to-object.util';
import { isObject } from '../utils/is-object.util';
import { isPresent } from '../utils/is-present.util';

export interface EntityProps {
  id: ID;
}

export abstract class Entity<T extends EntityProps> {
  constructor(props: T) {
    this.checkIfEmpty(props);
    this.validateId(props);
    this.validate(props);
    this.props = props;
  }

  protected readonly props: T;

  get id(): ID {
    return this.props.id;
  }

  static isEntity(entity: unknown): entity is Entity<EntityProps> {
    return entity instanceof Entity;
  }

  public equals(object?: Entity<T>): boolean {
    if (!isPresent(object)) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Entity.isEntity(object)) {
      return false;
    }

    return this.id.equals(object.id);
  }

  clone<C extends Entity<T>>(this: C, props: Partial<T>): C {
    const ctor = this.constructor as new (props: T) => C;

    return new ctor({
      ...this.props,
      ...props,
    });
  }

  public toJSON(): unknown {
    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy);
  }

  public toString(): string {
    return JSON.stringify(this.toJSON());
  }

  private checkIfEmpty(props: T) {
    if (!isObject(props)) {
      throw new ArgumentInvalidException(`Cannot create ${this.constructor.name} from non-object props`);
    }
  }

  protected abstract validate(props: T): void;

  private validateId(props: T) {
    if (!props.id) {
      throw new ArgumentNotProvidedException(`Property 'id' for ${this.constructor.name} not provided`);
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException(
        `Property 'id' for ${this.constructor.name} must be an instance of ${ID.name}`,
      );
    }
  }
}
