export class Game {
  gameId: number;

  playerId: [number, number];

  constructor(gameId: number, playerId: [number, number]) {
    this.gameId = gameId;
    this.playerId = playerId;
  }
}
