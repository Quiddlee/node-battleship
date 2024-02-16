import { randomUUID } from 'node:crypto';

export class User {
  readonly #login: string;

  readonly #password: string;

  readonly #id: string;

  #wins: number = 0;

  constructor(login: string, password: string) {
    this.#login = login;
    this.#password = password;
    this.#id = randomUUID();
  }

  public get login() {
    return this.#login;
  }

  public get password() {
    return this.#password;
  }

  public get id() {
    return this.#id;
  }

  public get wins() {
    return this.#wins;
  }

  public addWin() {
    this.#wins += 1;
    return this;
  }
}
