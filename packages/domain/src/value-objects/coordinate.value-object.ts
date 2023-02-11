import { ValueObject, isPresent, ArgumentNotProvidedException } from '@agnoc/toolkit';

export interface CoordinateProps {
  x: number;
  y: number;
}

export class Coordinate extends ValueObject<CoordinateProps> {
  get x(): number {
    return this.props.x;
  }

  get y(): number {
    return this.props.y;
  }

  protected validate(props: CoordinateProps): void {
    if (![props.x, props.y].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in coordinate constructor');
    }
  }
}
