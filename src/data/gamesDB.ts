import { Game } from '../models/game/game';

class GamesDB {
  private readonly gameList: Game[] = [];

  public createGame(playerId: number) {
    const gameId = this.gameList.length;
    const game = new Game(gameId, playerId);
    this.gameList.push(game);
    return game;
  }
}

export default new GamesDB();
