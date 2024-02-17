import { ShipPosition, ShipType } from './types/types';

export class Ship {
  readonly position: ShipPosition;

  readonly direction: boolean;

  readonly length: number;

  readonly type: ShipType;

  constructor(
    pos: ShipPosition,
    direction: boolean,
    len: number,
    type: ShipType,
  ) {
    this.position = pos;
    this.direction = direction;
    this.length = len;
    this.type = type;
  }
}
