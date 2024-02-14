import { randomUUID } from 'node:crypto';

export class User {
  readonly #login: string;

  readonly #password: string;

  readonly #id: string;

  constructor(login: string, password: string) {
    this.#login = login;
    this.#password = password;
    this.#id = randomUUID();
  }

  get login() {
    return this.#login;
  }

  get password() {
    return this.#password;
  }

  get id() {
    return this.#id;
  }
}
