import usersDB from './usersDB';
import { User } from '../models/user/user';

class WinnersDB {
  readonly winners: User[] = [];

  public updateWinners(id: number) {
    const winner = usersDB.findUserByIndex(id);
    const isWinnerAlreadyExist = this.winners.includes(winner);
    winner.addWin();

    if (!isWinnerAlreadyExist) this.winners.push(winner);
  }
}

export default new WinnersDB();
