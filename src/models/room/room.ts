// eslint-disable-next-line import/no-cycle
import roomsDB from '../../data/roomsDB';

export class Room {
  readonly roomId: number;

  readonly roomPlayerIds: [number] | [number, number];

  constructor(roomId: number, creatorId: number) {
    this.roomId = roomId;
    this.roomPlayerIds = [creatorId];
  }

  public addUser(userIndex: number) {
    const isUserAlreadyInTheRoom = this.roomPlayerIds.includes(userIndex);

    if (isUserAlreadyInTheRoom)
      throw new Error(
        "You can't join the room when you are already in the room",
      );

    this.roomPlayerIds.push(userIndex);
  }

  public delete() {
    const room = roomsDB.findRoom(this.roomId);
    roomsDB.deleteRoom(room.roomId);
    return this;
  }
}
