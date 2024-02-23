/* eslint-disable no-console */
import 'dotenv/config';
import {
  addShips,
  attack,
  checkFinish,
  createGame,
  randomAttack,
  sendTurn,
  singlePlay,
  startGame,
} from './src/controllers/gameControllers';
import {
  addUserToRoom,
  createRoom,
  sendRooms,
} from './src/controllers/roomControllers';
import { regUser, sendWinners } from './src/controllers/userControllers';
import { httpServer } from './src/http_server';
import { WSS } from './src/lib/utils/wss';
import { MsgType } from './src/types/enums';

const HTTP_PORT = Number(process.env.HTTP_PORT);
const WSS_PORT = Number(process.env.WSS_PORT);

// TODO: delete rooms after game is ended
// TODO: Send that the player already in the account if it tries to login in anoter tab
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

new WSS(WSS_PORT)
  .msg(MsgType.REG, regUser, sendRooms, sendWinners)
  .msg(MsgType.CREATE_ROOM, createRoom, sendRooms)
  .msg(MsgType.ADD_USER_ROOM, addUserToRoom, sendRooms, createGame)
  .msg(MsgType.ADD_SHIPS, addShips, startGame, sendTurn)
  .msg(MsgType.ATTACK, attack, checkFinish, sendTurn)
  .msg(MsgType.RANDOM_ATTACK, randomAttack, checkFinish, sendTurn)
  .msg(MsgType.SINGLE_PLAY, singlePlay);
