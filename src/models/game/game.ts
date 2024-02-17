import { ShipData } from './types/types';
import { Ship } from '../ship/ship';

export class Game {
  gameId: number;

  shipData: ShipData = {};

  constructor(gameId: number, [playerId1, playerId2]: [number, number]) {
    this.gameId = gameId;
    this.shipData[playerId1] = <Ship[]>[];
    this.shipData[playerId2] = <Ship[]>[];
  }

  public get playerIds() {
    return Object.keys(this.shipData).map((id) => Number(id));
  }

  public addShips(playerId: number, data: Ship[]) {
    this.shipData[playerId] = data;
  }

  public isReady() {
    const shipDataNum = Object.values(this.shipData);
    const isAllPlayersReady = shipDataNum.length === 2;
    return isAllPlayersReady;
  }

  public getPlayerShips(id: number) {
    return this.shipData[id];
  }
}
