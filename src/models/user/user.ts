export class User {
  readonly #login: string;

  readonly #password: string;

  #wins: number = 0;

  constructor(login: string, password: string) {
    this.#login = login;
    this.#password = password;
  }

  public get login() {
    return this.#login;
  }

  public get password() {
    return this.#password;
  }

  public get wins() {
    return this.#wins;
  }

  public addWin() {
    this.#wins += 1;
    return this;
  }
}
