import { Game } from '../models/game/game';

class GamesDB {
  private readonly gameList: Game[] = [];

  public createGame(playerIds: [number, number]) {
    const gameId = this.gameList.length;
    const game = new Game(gameId, playerIds);
    this.gameList.push(game);
    return game;
  }

  public findGame(index: number) {
    return this.gameList[index];
  }
}

export default new GamesDB();
