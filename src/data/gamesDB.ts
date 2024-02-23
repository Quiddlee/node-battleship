import { Game } from '../models/game/game';

class GamesDB {
  private readonly gameList: Game[] = [];

  public createGame(playerIds: [number, number]) {
    const gameId = this.gameList.length;
    const game = new Game(gameId, playerIds);
    this.gameList.push(game);
    return { game, gameId };
  }

  public findGame(index: number) {
    return this.gameList[index];
  }

  public deleteGame(index: number) {
    this.gameList.splice(index, 1);
    return this;
  }
}

export default new GamesDB();
