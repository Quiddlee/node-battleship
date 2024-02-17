export class Room {
  readonly roomId: number;

  readonly roomPlayerIds: [number] | [number, number];

  constructor(roomId: number, creatorId: number) {
    this.roomId = roomId;
    this.roomPlayerIds = [creatorId];
  }

  public addUser(userIndex: number) {
    // TODO: decide what to do if the user already in the room
    const isUserAlreadyInTheRoom = this.roomPlayerIds.includes(userIndex);

    if (isUserAlreadyInTheRoom)
      throw new Error(
        "You can't join the room when you are already in the room",
      );

    this.roomPlayerIds.push(userIndex);
  }
}
