import roomsDB from '../data/roomsDB';
import logResult from '../lib/utils/logResult';
import prepareRoomDataResponse from '../lib/utils/prepareRoomDataResponse';
import { Room } from '../models/room/room';
import { UpdateRoomDataRes } from '../models/room/types/types';
import { MsgType } from '../types/enums';
import { Cb } from '../types/types';

/**
 * Updates the rooms data for all clients.
 * @param {Object} clients - An object containing the clients to send the data to.
 * @param {Cb<MsgType.REG | MsgType.CREATE_ROOM>} clients.sendEach - A callback function that sends a message to each client.
 * @returns {void} - Returns nothing
 */
export const sendRooms: Cb = ({ clients }) => {
  const openRooms: UpdateRoomDataRes = roomsDB
    .filterOnePlayerRoom()
    .map(prepareRoomDataResponse);

  clients.sendEach(MsgType.UPDATE_ROOM, openRooms);
  logResult(openRooms);
};

/**
 * Creates a new room with the given client as the host.
 * @param {Object} ws - The WebSocket connection of the client.
 * @param {Object} clients - An object containing the clients data.
 * @param {Cb<MsgType.CREATE_ROOM, Room>} clients.query - A callback function that returns the client data by WebSocket connection.
 * @returns {void} - Returns nothing
 */
export const createRoom: Cb<MsgType.CREATE_ROOM, Room> = ({ ws, clients }) => {
  return roomsDB.createRoom(clients.query(ws).id);
};

/**
 * Adds a user to a room by their WebSocket connection id and room index.
 * @param {Object} data - The data received from the client.
 * @param {number} data.indexRoom - The index of the room to join.
 * @param {Object} ws - The WebSocket connection of the user.
 * @param {number} ws.id - The id of the user.
 * @returns {void} - Returns nothing
 */
export const addUserToRoom: Cb<MsgType.ADD_USER_ROOM> = ({
  data: { indexRoom },
  ws,
}) => {
  const roomToJoin = roomsDB.findRoomByUserId(ws.id);

  // if user trying to join room that he created do nothing
  if (roomToJoin?.roomId === indexRoom) return;

  roomToJoin?.delete();
  roomsDB.addUserRoom(indexRoom, ws.id);
};
