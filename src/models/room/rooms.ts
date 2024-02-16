import { Room } from './types/types';

class Rooms {
  private readonly roomList: Room[] = [];

  public createRoom(playersId: number) {
    const room: Room = {
      idGame: this.roomList.length,
      idPlayers: [playersId],
    };

    this.roomList.push(room);
    return room;
  }

  public findRooms() {
    return this.roomList.filter((rooms) => rooms.idPlayers.length === 1);
  }

  public getRoom(roomIndex: number) {
    return this.roomList[roomIndex];
  }

  public addUserRoom(roomIndex: number, userIndex: number) {
    const room = this.getRoom(roomIndex);
    room.idPlayers = <[number, number]>[...room.idPlayers, userIndex];
  }
}

export default new Rooms();
