import { ID } from '../domain-primitives/id.domain-primitive';
import { convertPropsToObject } from '../utils/convert-props-to-object.util';
import { isPresent } from '../utils/is-present.util';
import { Validatable } from './validatable.base';

export interface EntityProps {
  id: ID;
}

export abstract class Entity<T extends EntityProps = EntityProps> extends Validatable<T> {
  constructor(props: T) {
    super(props);
    this.validateId(props);
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

  toJSON(): unknown {
    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy);
  }

  override toString(): string {
    return JSON.stringify(this.toJSON());
  }

  private validateId(props: T) {
    this.validateDefinedProp(props, 'id');
    this.validateInstanceProp(props, 'id', ID);
  }
}
