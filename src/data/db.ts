import { User } from '../models/user/user';

const testWinner = new User('Bohdan', '1');
testWinner.addWin();

// TODO: break the class into 2 smaller one's with only users and only winners and extend the db
class DB {
  private readonly users: User[] = [];

  readonly #winners: User[] = [testWinner];

  public createUser(login: string, password: string): [User, number] {
    const newUser = new User(login, password);
    this.users.push(newUser);
    const newUserIndex = this.users.length - 1;
    return [newUser, newUserIndex];
  }

  public findUser(id: number) {
    return this.users[id];
  }

  public updateWinners(id: number) {
    const winner = this.findUser(id);
    winner.addWin();
    this.#winners.push(winner);
  }

  public get winners() {
    return this.#winners;
  }
}

export default new DB();
