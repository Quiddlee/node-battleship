import { Ship } from '../../ship/ship';
import { HitStatus } from '../../ship/types/enums';
import { ShipPosition } from '../../ship/types/types';

export type ShipData = {
  [key: number]: Ship[];
};

export type HittedCells = {
  [key: number]: ShipPosition[];
};

export type CreateGameDataRes = {
  idGame: number;
  idPlayer: number;
};

export type StartGameDataRes = {
  ships: Ship[];
  currentPlayerIndex: number;
};

export type TurnDataRes = {
  currentPlayer: number;
};

export type AttackReq = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type AttackDataRes = {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: HitStatus;
};

export type RandomAttackReq = {
  gameId: number;
  indexPlayer: number;
};

export type FinishRes = {
  winPlayer: number;
};
