import prepareRoomDataResponse from '../lib/utils/prepareRoomDataResponse';
import rooms from '../models/room/rooms';
import { UpdateRoomDataRes } from '../models/room/types/types';
import { MsgType } from '../types/enums';
import { Cb } from '../types/types';

/**
 * Updates the rooms data for all clients.
 * @param {Object} clients - An object containing the clients to send the data to.
 * @param {Cb<MsgType.REG | MsgType.CREATE_ROOM>} clients.sendEach - A callback function that sends a message to each client.
 */
export const sendRooms: Cb = ({ clients }) => {
  const openRooms: UpdateRoomDataRes = rooms
    .findRoomsWithOnePlayer()
    .map(prepareRoomDataResponse);

  clients.sendEach(MsgType.UPDATE_ROOM, openRooms);
};

/**
 * Creates a new room with the given client as the host.
 * @param {Object} ws - The WebSocket connection of the client.
 * @param {Object} clients - An object containing the clients data.
 * @param {Cb<MsgType.CREATE_ROOM>} clients.query - A callback function that returns the client data by WebSocket connection.
 */
export const createRoom: Cb<MsgType.CREATE_ROOM> = ({ ws, clients }) => {
  rooms.createRoom(clients.query(ws).id);
};

/**
 * Adds a user to a room by their WebSocket connection id and room index.
 * @param {Object} data - The data received from the client.
 * @param {number} data.indexRoom - The index of the room to join.
 * @param {Object} ws - The WebSocket connection of the user.
 * @param {number} ws.id - The id of the user.
 */
export const addUserToRoom: Cb<MsgType.ADD_USER_ROOM> = ({ data, ws }) => {
  const { indexRoom } = data;
  rooms.addUserRoom(indexRoom, ws.id);
};
