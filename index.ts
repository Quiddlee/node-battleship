/* eslint-disable no-console */
import 'dotenv/config';
import { createRoom, updateRooms } from './src/controllers/roomControllers';
import { regUser, sendWinners } from './src/controllers/userControllers';
import { httpServer } from './src/http_server';
import { WSS } from './src/lib/utils/wss';
import { MsgType } from './src/types/enums';

const HTTP_PORT = Number(process.env.HTTP_PORT);
const WSS_PORT = Number(process.env.WSS_PORT);

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WSS(WSS_PORT);

wss
  .msg(MsgType.REG, regUser, updateRooms, sendWinners)
  .msg(MsgType.CREATE_ROOM, createRoom, updateRooms)
  .msg(MsgType.ADD_USER_ROOM, ({ data }) => {
    console.log(data);
  });
