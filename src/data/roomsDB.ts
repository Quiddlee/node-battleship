import { Room } from '../models/room/room';

class RoomsDB {
  private readonly roomList: Room[] = [];

  public createRoom(playersId: number) {
    // if user is already in the room we create delete this "old" room and create new one
    const playerRoomIndex = this.roomList.findIndex((r) =>
      r.roomPlayerIds.includes(playersId),
    );

    if (playerRoomIndex !== -1) {
      this.deleteRoom(playerRoomIndex);
    }

    const room = new Room(this.roomList.length, playersId);
    this.roomList.push(room);
    return room;
  }

  public deleteRoom(roomIndex: number) {
    this.roomList.splice(roomIndex, 1);
  }

  public filterOnePlayerRoom() {
    return this.roomList.filter((rooms) => rooms.roomPlayerIds.length === 1);
  }

  public findRoom(roomIndex: number) {
    return this.roomList[roomIndex];
  }

  public addUserRoom(roomIndex: number, userIndex: number) {
    const room = this.findRoom(roomIndex);
    room.addUser(userIndex);
  }
}

export default new RoomsDB();
