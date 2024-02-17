import { HitStatus } from './types/enums';
import { ShipPosition, ShipType } from './types/types';

export class Ship {
  readonly position: ShipPosition;

  readonly direction: boolean;

  readonly length: number;

  readonly type: ShipType;

  private posPoints: number[] = [];

  constructor({ type, direction, length, position }: Ship) {
    this.position = position;
    this.direction = direction;
    this.length = length;
    this.type = type;

    this.calcShipPosition();
  }

  public hitStatus(x: number, y: number) {
    const isVertical = this.direction;
    const { x: shipX, y: shipY } = this.position;
    const majorCoords = isVertical ? y : x;
    const minorCoord = isVertical ? x : y;
    const minorShipCoord = isVertical ? shipX : shipY;

    const isMinorHit = minorCoord === minorShipCoord;
    const indexOfMajorHitCoord = this.posPoints.indexOf(majorCoords);
    const isMajorHit = indexOfMajorHitCoord !== -1;

    if (!isMajorHit || !isMinorHit) return HitStatus.MISS;

    this.posPoints.splice(indexOfMajorHitCoord, 1);

    if (this.posPoints.length === 0) {
      return HitStatus.KILLED;
    }

    return HitStatus.SHOT;
  }

  public isHit(x: number, y: number) {
    const isVertical = this.direction;
    const { x: shipX, y: shipY } = this.position;
    const minorCoord = isVertical ? x : y;
    const minorShipCoord = isVertical ? shipX : shipY;
    const major = isVertical ? y : x;

    const isMinorHit = minorCoord === minorShipCoord;
    const isMajorHit = this.posPoints.includes(major);

    return isMajorHit && isMinorHit;
  }

  private calcShipPosition() {
    const isVertical = this.direction;
    const { x, y } = this.position;

    const start = isVertical ? y : x;
    this.posPoints = Array.from({ length: this.length }, (_, i) => start + i);
  }
}
