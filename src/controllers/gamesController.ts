import gamesDB from '../data/gamesDB';
import roomsDB from '../data/roomsDB';
import { CreateGameDataRes } from '../models/game/types/types';
import { MsgType } from '../types/enums';
import { Cb } from '../types/types';

/**
 * Creates a new game with the given user as the host and sends the game data to all clients.
 * @param {Object} clients - An object containing the clients to send the data to.
 * @param {Cb<MsgType.ADD_USER_ROOM>} clients.sendEach - A callback function that sends a message to each client.
 * @param {Object} ws - The WebSocket connection of the user.
 * @param {number} ws.id - The id of the user.
 */
export const createGame: Cb<MsgType.ADD_USER_ROOM> = ({
  data: { indexRoom },
  clients,
}) => {
  const room = roomsDB.findRoom(indexRoom);
  const ids = room.roomPlayerIds;

  if (ids.length === 1)
    throw new Error('Cannot create game with only 1 player in the room!');

  const { gameId } = gamesDB.createGame(ids);
  ids.forEach((id) => {
    const responseData: CreateGameDataRes = {
      idGame: gameId,
      idPlayer: id,
    };

    clients.queryById(id).send(MsgType.CREATE_GAME, responseData);
  });
};

export const addShips: Cb<MsgType.ADD_SHIPS> = ({ data }) => {
  console.log(data);
};
