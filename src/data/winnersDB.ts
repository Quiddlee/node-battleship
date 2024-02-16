import usersDB from './usersDB';
import { User } from '../models/user/user';

const testWinner = new User('Bohdan', '1');
testWinner.addWin();

class WinnersDB {
  readonly winners: User[] = [testWinner];

  public updateWinners(id: number) {
    const winner = usersDB.findUser(id);
    const isWinnerAlreadyExist = this.winners.includes(winner);

    if (isWinnerAlreadyExist) {
      winner.addWin();
      return;
    }

    this.winners.push(winner);
  }
}

export default new WinnersDB();
