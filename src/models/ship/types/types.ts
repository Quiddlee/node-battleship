import type { Ship } from '../ship';

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export type ShipPosition = {
  x: number;
  y: number;
};

export type AddShipData = {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
};
