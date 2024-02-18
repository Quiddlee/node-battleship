import gamesDB from '../data/gamesDB';
import roomsDB from '../data/roomsDB';
import winnersDB from '../data/winnersDB';
import getRandomArbitrary from '../lib/utils/getRandomInt';
import {
  CreateGameDataRes,
  FinishRes,
  StartGameDataRes,
  TurnDataRes,
} from '../models/game/types/types';
import { HitStatus } from '../models/ship/types/enums';
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

/**
 * Sends the turn data to all players in the game.
 * @param {Object} args - The object containing the data and clients properties.
 * @param {Object} args.data - The data sent by the client.
 * @param {string} args.data.gameId - The ID of the game.
 * @param {Clients} args.clients - The array with all websocket clients.
 */
export const sendTurn: Cb<
  MsgType.ADD_SHIPS | MsgType.ATTACK | MsgType.RANDOM_ATTACK
> = ({ data: { gameId }, clients }) => {
  const { currentPlayerTurn, playerIds } = gamesDB.findGame(gameId);

  const res: TurnDataRes = {
    currentPlayer: currentPlayerTurn,
  };

  playerIds.forEach((id) => {
    const client = clients.queryById(id);
    client.send(MsgType.TURN, res);
  });
};

/**
 * Sends the attack feedback to all players in the game.
 * @param {Object} args - The object containing the data and clients properties.
 * @param {Object} args.data - The data sent by the client.
 * @param {string} args.data.gameId - The ID of the game.
 * @param {number} args.data.indexPlayer - The index of the player who made the attack.
 * @param {number} args.data.x - The x coordinate of the attack position.
 * @param {number} args.data.y - The y coordinate of the attack position.
 * @param {Clients} args.clients - The clients manager instance.
 */
export const attack: Cb<MsgType.ATTACK> = ({
  data: { gameId, indexPlayer, x, y },
  clients,
}) => {
  const game = gamesDB.findGame(gameId);
  const notCurrPlayersTurn = game.currentPlayerTurn !== indexPlayer;

  if (notCurrPlayersTurn) return;

  const enemyShips = game.getPlayerShips(game.getEnemy());
  const hittedShip = enemyShips.find((ship) => ship.isHit(x, y));

  if (!hittedShip) {
    game.changeTurn();

    const res = {
      position: { x, y },
      currentPlayer: indexPlayer,
      status: HitStatus.MISS,
    };

    clients.sendEach(MsgType.ATTACK, res);
    return;
  }

  const status = hittedShip.hitStatus(x, y);

  if (status === HitStatus.SHOT) {
    const res = {
      position: { x, y },
      currentPlayer: indexPlayer,
      status,
    };

    clients.sendEach(MsgType.ATTACK, res);
    return;
  }

  hittedShip.posPointsHit.forEach((pos) => {
    const isVertical = hittedShip.direction;
    const position = {
      x: isVertical ? x : pos,
      y: isVertical ? pos : y,
    };

    const res = {
      position,
      currentPlayer: indexPlayer,
      status: HitStatus.KILLED,
    };

    clients.sendEach(MsgType.ATTACK, res);
  });

  hittedShip.cellsAround.forEach((position) => {
    const res = {
      position,
      currentPlayer: indexPlayer,
      status: HitStatus.MISS,
    };

    clients.sendEach(MsgType.ATTACK, res);
  });
};

/**
 * Attacks a random position on the enemy's board and sends the attack result to all players in the game.
 * @param {Object} args - The object containing the data and clients properties.
 * @param {Object} args.data - The data sent by the client.
 * @param {string} args.data.gameId - The ID of the game.
 * @param {number} args.data.indexPlayer - The index of the player who made the attack.
 */
export const randomAttack: Cb<MsgType.RANDOM_ATTACK> = (args) => {
  const {
    data: { gameId, indexPlayer },
  } = args;
  const x = getRandomArbitrary(0, 9);
  const y = getRandomArbitrary(0, 9);

  attack({
    ...args,
    data: {
      gameId,
      indexPlayer,
      x,
      y,
    },
  });
};

/**
 * Checks if the game is finished and sends the finish message to all players in the game.
 * @param {Object} args - The object containing the data and clients properties.
 * @param {Object} args.data - The data sent by the client.
 * @param {string} args.data.gameId - The ID of the game.
 * @param {Clients} args.clients - The clients manager instance.
 * @throws {Error} error - The error that is thrown in order to stop next callbacks in the queue
 */
export const checkFinish: Cb<MsgType.ATTACK | MsgType.RANDOM_ATTACK> = ({
  data: { gameId },
  clients,
}) => {
  const game = gamesDB.findGame(gameId);
  const winner = game.getWinner();

  if (winner === null) return;

  const res: FinishRes = {
    winPlayer: winner,
  };

  clients.sendEach(MsgType.FINISH, res);
  winnersDB.updateWinners(winner);

  throw new Error('The game has been finished, all next callbacks is stoped');
};
