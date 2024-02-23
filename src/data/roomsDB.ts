// eslint-disable-next-line import/no-cycle
import { Room } from '../models/room/room';

class RoomsDB {
  private readonly roomList: Room[] = [];

  public createRoom(playersId: number) {
    // if user is already in the room we create delete this "old" room and create new one
    this.findRoomByUserId(playersId)?.delete();

    const room = new Room(this.roomList.length, playersId);
    this.roomList.push(room);
    return room;
  }

  public deleteRoom(roomIndex: number) {
    this.roomList.splice(roomIndex, 1);
    return this;
  }

  public filterOnePlayerRoom() {
    return this.roomList.filter((rooms) => rooms.roomPlayerIds.length === 1);
  }

  public findRoomByUserId(userId: number) {
    return this.roomList.find((room) => room.roomId === userId);
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
