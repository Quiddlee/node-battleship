export class Room {
  readonly idGame: number;

  readonly idPlayers: [number] | [number, number];

  constructor(idGame: number, idPlayer: number) {
    this.idGame = idGame;
    this.idPlayers = [idPlayer];
  }

  public addUser(userIndex: number) {
    // TODO: decide what to do if the user already in the room
    const isUserAlreadyInTheRoom = this.idPlayers.includes(userIndex);
    if (!isUserAlreadyInTheRoom) this.idPlayers.push(userIndex);
  }
}
