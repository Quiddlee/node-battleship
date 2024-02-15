import { Room } from './types/types';

class Rooms {
  private readonly roomList: Room[] = [];

  createRoom(playersId: number) {
    const room: Room = {
      idGame: this.roomList.length - 1,
      idPlayers: [playersId],
    };

    this.roomList.push(room);
    return room;
  }

  findRooms() {
    return this.roomList.filter((rooms) => rooms.idPlayers.length === 1);
  }
}

export default new Rooms();
