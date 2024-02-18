import { HitStatus } from './types/enums';
import { ShipPosition, ShipType } from './types/types';

export class Ship {
  readonly position: ShipPosition;

  readonly direction: boolean;

  readonly length: number;

  readonly type: ShipType;

  private posPoints: number[] = [];

  public readonly posPointsHit: number[] = [];

  private isKilled = false;

  public readonly cellsAround: ShipPosition[] = [];

  constructor({ type, direction, length, position }: Ship) {
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
          this.cellsAround.push(this.cell(shipX, p));
        }

        this.cellsAround.push(this.cell(shipX + 1, p));
        this.cellsAround.push(this.cell(shipX - 1, p));
        return;
      }

      if (i === 0 || i === pointsCopy.length - 1) {
        this.cellsAround.push(this.cell(p, shipY));
      }

      this.cellsAround.push(this.cell(p, shipY + 1));
      this.cellsAround.push(this.cell(p, shipY - 1));
    });
  }

  private cell(x: number, y: number) {
    return { x, y };
  }

  private calcShipPosition() {
    const isVertical = this.direction;
    const { x, y } = this.position;

    const start = isVertical ? y : x;
    this.posPoints = Array.from({ length: this.length }, (_, i) => start + i);
  }
}
