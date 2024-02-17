import gamesDB from '../data/gamesDB';
import roomsDB from '../data/roomsDB';
import {
  CreateGameDataRes,
  StartGameDataRes,
} from '../models/game/types/types';
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

/**
 * Adds ships to the game specific instance.
 * @param {Object} args - The object containing the data property.
 * @param {Object} args.data - The data sent by the client.
 * @param {string} args.data.gameId - The ID of the game.
 * @param {Array<Ship>} args.data.ships - The array of ships to be added.
 * @param {number} args.data.indexPlayer - The index of the player who added the ships.
 */
export const addShips: Cb<MsgType.ADD_SHIPS> = ({
  data: { gameId, ships, indexPlayer },
}) => {
  const game = gamesDB.findGame(gameId);
  game.addShips(indexPlayer, ships);
};

/**
 * Starts the game and sends the game data to all players.
 * @param {Object} args - The object containing the data and clients properties.
 * @param {Object} args.data - The data sent by the client.
 * @param {string} args.data.gameId - The ID of the game.
 * @param {Clients} args.clients - The clients manager instance.
 */
export const startGame: Cb<MsgType.ADD_SHIPS> = ({
  data: { gameId },
  clients,
}) => {
  const game = gamesDB.findGame(gameId);
  const { playerIds } = game;

  if (!game.isReady()) return;

  playerIds.forEach((id) => {
    const resData: StartGameDataRes = {
      ships: game.getPlayerShips(id),
      currentPlayerIndex: id,
    };
    clients.queryById(id).send(MsgType.START_GAME, resData);
  });
};
