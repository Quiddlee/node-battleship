export type ShipType = 'small' | 'medium' | 'large' | 'huge';
export type ShipLength = 1 | 2 | 3 | 4;

export type ShipPosition = {
  x: number;
  y: number;
};

export type ShipDataReq = {
  position: ShipPosition;
  direction: boolean;
  type: ShipType;
  length: ShipLength;
};

export type AddShipData = {
  gameId: number;
  ships: ShipDataReq[];
  indexPlayer: number;
};
