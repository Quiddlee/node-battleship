import { ShipData } from './types/types';
import { Ship } from '../ship/ship';

export class Game {
  gameId: number;

  shipData: ShipData = {};

  currentPlayerTurn;

  constructor(gameId: number, [playerId1, playerId2]: [number, number]) {
    this.gameId = gameId;
    this.shipData[playerId1] = null as unknown as Ship[];
    this.shipData[playerId2] = null as unknown as Ship[];
    this.currentPlayerTurn = playerId1;
  }

  public get playerIds() {
    return Object.keys(this.shipData).map((id) => Number(id));
  }

  public changeTurn() {
    this.currentPlayerTurn = this.getEnemy();
    return this;
  }

  public addShips(playerId: number, data: Ship[]) {
    if (this.isReady())
      throw new Error('Cannot add ships data, the game is already running!');
    this.shipData[playerId] = data.map((shipData) => new Ship(shipData));
  }

  public isReady() {
    const shipDataNum = Object.values(this.shipData).filter(Boolean);
    const isAllPlayersReady = shipDataNum.length === 2;
    return isAllPlayersReady;
  }

  public getPlayerShips(id: number) {
    return this.shipData[id];
  }

  public getEnemy() {
    const ids = this.playerIds;
    const curr = this.currentPlayerTurn;
    const currIndex = ids.indexOf(curr);

    return <number>ids.toSpliced(currIndex, 1).at(0);
  }

  public isFinish() {
    const firstPlayerShips = this.getPlayerShips(<number>this.playerIds.at(0));
    const secondPlayerShips = this.getPlayerShips(<number>this.playerIds.at(1));

    const isFirstPlayerShipsDestroyed = firstPlayerShips.every(
      (ship) => ship.isKilled,
    );
    const isSecondPlayerShipsDestroyed = secondPlayerShips.every(
      (ship) => ship.isKilled,
    );

    return isFirstPlayerShipsDestroyed || isSecondPlayerShipsDestroyed;
  }

  public getWinner() {
    if (!this.isFinish()) return null;

    const firstPlayer = <number>this.playerIds.at(0);
    const secondPlayer = <number>this.playerIds.at(1);
    const firstPlayerShips = this.getPlayerShips(firstPlayer);

    const isFirstPlayerShipsDestroyed = firstPlayerShips.every(
      (ship) => ship.isKilled,
    );

    if (isFirstPlayerShipsDestroyed) {
      return secondPlayer;
    }

    return firstPlayer;
  }
}
