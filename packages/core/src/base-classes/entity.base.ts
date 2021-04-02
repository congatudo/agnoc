import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { convertPropsToObject } from "../utils/convert-props-to-object.util";
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

    return this.id ? this.id.equals(object.id) : false;
  }

  public getPropsCopy(): EntityProps & BaseEntityProps {
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
    if (typeof props !== "object") {
      throw new ArgumentInvalidException("Entity props should be an object");
    }
  }
}
