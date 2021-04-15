import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { convertPropsToObject } from "../utils/convert-props-to-object.util";
import { isObject } from "../utils/is-object.util";
import { isPresent } from "../utils/is-present.util";
import { ID } from "../value-objects/id.value-object";

export interface BaseEntityProps {
  id: ID;
}

export abstract class Entity<EntityProps extends BaseEntityProps> {
  constructor(props: EntityProps) {
    this.validateProps(props);
    this.props = props;
  }

  protected readonly props: EntityProps;

  get id(): ID {
    return this.props.id;
  }

  static isEntity(entity: unknown): entity is Entity<BaseEntityProps> {
    return entity instanceof Entity;
  }

  public equals(object?: Entity<EntityProps>): boolean {
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

  public getPropsCopy(): EntityProps {
    const propsCopy = {
      ...this.props,
    };

    return Object.freeze(propsCopy);
  }

  public toJSON(): unknown {
    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy);
  }

  public toString(): string {
    return JSON.stringify(this.toJSON());
  }

  private validateProps(props: EntityProps) {
    if (!isObject(props)) {
      throw new ArgumentInvalidException("Entity props should be an object");
    }

    if (!props.id) {
      throw new ArgumentNotProvidedException("Entity props must have an id");
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException("Entity id must a valid ID object");
    }
  }
}
