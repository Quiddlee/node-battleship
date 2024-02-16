export class Room {
  readonly roomId: number;

  readonly roomPlayersId: [number] | [number, number];

  constructor(roomId: number, creatorId: number) {
    this.roomId = roomId;
    this.roomPlayersId = [creatorId];
  }

  public addUser(userIndex: number) {
    // TODO: decide what to do if the user already in the room
    const isUserAlreadyInTheRoom = this.roomPlayersId.includes(userIndex);

    if (isUserAlreadyInTheRoom)
      throw new Error(
        "You can't join the room when you are already in the room",
      );

    this.roomPlayersId.push(userIndex);
  }
}
