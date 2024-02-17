import { ShipData } from './types/types';
import { Ship } from '../ship/ship';

export class Game {
  gameId: number;

  shipData: ShipData = {};

  #currentPlayerTurn = 0;

  constructor(gameId: number, [playerId1, playerId2]: [number, number]) {
    this.gameId = gameId;
    this.shipData[playerId1] = null as unknown as Ship[];
    this.shipData[playerId2] = null as unknown as Ship[];
    this.#currentPlayerTurn = playerId1;
  }

  public get playerIds() {
    return Object.keys(this.shipData).map((id) => Number(id));
  }

  public get currentPlayerTurn() {
    // TODO: make sure that it works fine
    const ids = this.playerIds;
    const curr = this.#currentPlayerTurn;
    const currIndex = ids.indexOf(curr);

    ids.splice(currIndex, 1);
    this.#currentPlayerTurn = <number>ids.at(0);

    return curr;
  }

  public addShips(playerId: number, data: Ship[]) {
    if (this.isReady())
      throw new Error('Cannot add ships data, the game is already running!');
    this.shipData[playerId] = data;
  }

  public isReady() {
    const shipDataNum = Object.values(this.shipData).filter(Boolean);
    const isAllPlayersReady = shipDataNum.length === 2;
    return isAllPlayersReady;
  }

  public getPlayerShips(id: number) {
    return this.shipData[id];
  }
}
