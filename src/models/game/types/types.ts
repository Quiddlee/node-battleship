import { Ship } from '../../ship/ship';

export type CreateGameDataRes = {
  idGame: number;
  idPlayer: number;
};

export type StartGameDataRes = {
  ships: Ship[];
  currentPlayerIndex: number;
};

export type ShipData = {
  [key: number]: Ship[];
};
