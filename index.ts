/* eslint-disable no-console */
import 'dotenv/config';

import db from './src/data/db';
import { httpServer } from './src/http_server';
import prepareRoomDataResponse from './src/lib/utils/prepareRoomDataResponse';
import { WSS } from './src/lib/utils/wss';
import rooms from './src/models/room/rooms';
import { UpdateRoomServerRes } from './src/models/room/types/types';
import { RegServerResponse } from './src/models/user/types/types';
import { MsgType } from './src/types/enums';

const HTTP_PORT = Number(process.env.HTTP_PORT);
const WSS_PORT = Number(process.env.WSS_PORT);

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WSS(WSS_PORT);

wss.msg(MsgType.REG, ({ data, ws }) => {
  console.log('message from client', data);
  const { name, password } = data;
  const [user, index] = db.createUser(name, password);

  // TODO: abstract creating response in separate method
  const createUserRes: RegServerResponse = {
    type: MsgType.REG,
    data: {
      name: user.login,
      index,
      error: false,
      errorText: '',
    },
    id: 0,
  };

  const updateRoomMsg: UpdateRoomServerRes = {
    type: MsgType.UPDATE_ROOM,
    data: rooms.findRooms().map(prepareRoomDataResponse),
    id: 0,
  };

  ws.send(createUserRes).send(updateRoomMsg);
  Object.defineProperty(ws, 'id', { value: index });
});

wss.msg(MsgType.CREATE_ROOM, ({ ws, clients }) => {
  rooms.createRoom(clients.query(ws).id);

  const updateRoomMsg: UpdateRoomServerRes = {
    type: MsgType.UPDATE_ROOM,
    data: rooms.findRooms().map(prepareRoomDataResponse),
    id: 0,
  };

  clients.each().send(updateRoomMsg);
});

wss.msg(MsgType.ADD_USER_ROOM, ({ data }) => {
  console.log(data);
});
