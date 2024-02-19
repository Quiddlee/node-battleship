import { User } from '../models/user/user';

class UsersDB {
  private readonly users: User[] = [];

  public createUser(login: string, password: string): [User, number] {
    if (this.isUserAlreadyExist(login))
      throw new Error('The user with this login is already exist!');

    const newUser = new User(login, password);
    this.users.push(newUser);
    const newUserIndex = this.users.length - 1;
    return [newUser, newUserIndex];
  }

  public findUserByIndex(index: number) {
    return this.users[index];
  }

  public loginUser(login: string, password: string): [User, number] {
    const user = this.users.find((usr) => usr.login === login);
    const index = this.users.findIndex((usr) => usr.login === login);

    if (!user) throw new Error('The user does not exist!');
    if (user.password !== password) throw new Error('Wrong password provided!');

    return [user, index];
  }

  public isUserAlreadyExist(login: string) {
    return this.users.some((usr) => usr.login === login);
  }
}

export default new UsersDB();
