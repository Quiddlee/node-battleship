import { cell } from '../../lib/utils';

import { HitStatus, ShipDataReq, ShipLength, ShipPosition, ShipType } from '.';

export class Ship {
  readonly position: ShipPosition;

  readonly direction: boolean;

  readonly length: ShipLength;

  readonly type: ShipType;

  private posPoints: number[] = [];

  public readonly posPointsHit: number[] = [];

  public isKilled = false;

  public readonly cellsAround: ShipPosition[] = [];

  constructor({ type, direction, length, position }: ShipDataReq) {
    this.position = position;
    this.direction = direction;
    this.length = length;
    this.type = type;

    this.calcShipPosition();
    this.calcCellsAround();
  }

  public hitStatus(x: number, y: number) {
    const isVertical = this.direction;
    const { x: shipX, y: shipY } = this.position;
    const majorCoord = isVertical ? y : x;
    const minorCoord = isVertical ? x : y;
    const minorShipCoord = isVertical ? shipX : shipY;

    if (this.posPointsHit.includes(majorCoord) && this.isKilled)
      return HitStatus.KILLED;
    if (this.posPointsHit.includes(majorCoord)) return HitStatus.SHOT;

    const isMinorHit = minorCoord === minorShipCoord;
    const isMajorHit = this.posPoints.includes(majorCoord);

    if (!isMajorHit || !isMinorHit) return HitStatus.MISS;
    this.posPointsHit.push(majorCoord);

    if (this.posPoints.length === this.posPointsHit.length) {
      this.isKilled = true;
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

  private calcCellsAround() {
    const pointsCopy = [...this.posPoints];
    const isVertical = this.direction;
    const { x: shipX, y: shipY } = this.position;

    const firstPoint = pointsCopy.at(0)! - 1;
    const lastPoint = pointsCopy.at(-1)! + 1;

    pointsCopy.unshift(firstPoint);
    pointsCopy.push(lastPoint);

    pointsCopy.forEach((p, i) => {
      if (isVertical) {
        if (i === 0 || i === pointsCopy.length - 1) {
          this.cellsAround.push(cell(shipX, p));
        }

        this.cellsAround.push(cell(shipX + 1, p));
        this.cellsAround.push(cell(shipX - 1, p));
        return;
      }

      if (i === 0 || i === pointsCopy.length - 1) {
        this.cellsAround.push(cell(p, shipY));
      }

      this.cellsAround.push(cell(p, shipY + 1));
      this.cellsAround.push(cell(p, shipY - 1));
    });
  }

  private calcShipPosition() {
    const isVertical = this.direction;
    const { x, y } = this.position;

    const start = isVertical ? y : x;
    this.posPoints = Array.from({ length: this.length }, (_, i) => start + i);
  }
}
