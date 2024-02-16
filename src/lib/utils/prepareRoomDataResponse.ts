import db from '../../data/usersDB';
import { Room } from '../../models/room/room';
import { UpdateRoomData } from '../../models/room/types/types';

/**
 * Prepares the room data response object from a room db
 * @param {Room} room - The room instance
 * @returns {UpdateRoomData} The room data response object with roomId and roomUsers properties
 */
const prepareRoomDataResponse = (room: Room): UpdateRoomData => ({
  roomId: room.roomId,
  roomUsers: room.roomPlayersId.map((id) => {
    const { login } = db.findUser(id);

    return {
      name: login,
      index: id,
    };
  }),
});

export default prepareRoomDataResponse;
