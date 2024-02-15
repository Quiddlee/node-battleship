import { User } from '../models/user/user';

class DB {
  private readonly users: User[] = [];

  public createUser(login: string, password: string): [User, number] {
    const newUser = new User(login, password);
    this.users.push(newUser);
    const newUserIndex = this.users.length - 1;
    return [newUser, newUserIndex];
  }

  public findUser(id: number) {
    return this.users[id];
  }
}

export default new DB();
