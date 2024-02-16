export class Game {
  gameId: number;

  playerId: number;

  constructor(gameId: number, playerId: number) {
    this.gameId = gameId;
    this.playerId = playerId;
  }
}
