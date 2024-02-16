export class Room {
  readonly idGame: number;

  readonly idPlayers: [number] | [number, number];

  constructor(idGame: number, idPlayer: number) {
    this.idGame = idGame;
    this.idPlayers = [idPlayer];
  }

  public addUser(userIndex: number) {
    this.idPlayers.push(userIndex);
  }
}
