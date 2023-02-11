import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

export interface PixelProps {
  x: number;
  y: number;
}

export class Pixel extends ValueObject<PixelProps> {
  get x(): number {
    return this.props.x;
  }

  get y(): number {
    return this.props.y;
  }

  protected validate(props: PixelProps): void {
    if (![props.x, props.y].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in pixel constructor');
    }

    if (![props.x, props.y].every((prop) => Number.isInteger(prop) && prop >= 0)) {
      throw new ArgumentInvalidException('Invalid property in pixel constructor');
    }
  }
}
