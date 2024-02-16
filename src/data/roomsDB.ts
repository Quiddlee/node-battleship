import { Room } from '../models/room/room';

class RoomsDB {
  private readonly roomList: Room[] = [];

  public createRoom(playersId: number) {
    const room = new Room(this.roomList.length, playersId);
    this.roomList.push(room);
    return room;
  }

  public filterOnePlayerRoom() {
    return this.roomList.filter((rooms) => rooms.roomPlayersId.length === 1);
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
