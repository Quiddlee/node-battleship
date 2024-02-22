import { usersDB } from '../../data';
import { Room, UpdateRoomData } from '../../models/room';

/**
 * Prepares the room data response object from a room db
 * @param {Room} room - The room instance
 * @returns {UpdateRoomData} The room data response object with roomId and roomUsers properties
 */
const prepareRoomDataResponse = (room: Room): UpdateRoomData => ({
  roomId: room.roomId,
  roomUsers: room.roomPlayerIds.map((id) => {
    const { login } = usersDB.findUserByIndex(id);

    return {
      name: login,
      index: id,
    };
  }),
});

export default prepareRoomDataResponse;
