/* eslint-disable no-console */
import 'dotenv/config';

import db from './src/data/db';
import { httpServer } from './src/http_server';
import { WSS } from './src/lib/utils/wss';
import rooms from './src/models/room/rooms';
import { UpdateRoomData, UpdateRoomMsg } from './src/models/room/types/types';
import { RegMsg, RegServerData } from './src/models/user/types/types';
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
  const createUserResData: RegServerData = {
    name: user.login,
    index,
    error: false,
    errorText: '',
  };
  const createUserRes: RegMsg = {
    type: MsgType.REG,
    data: JSON.stringify(createUserResData),
    id: 0,
  };

  const updateRoomResData: UpdateRoomData = rooms.findRooms().map((room) => ({
    roomId: room.idGame,
    roomUsers: room.idPlayers.map((id) => {
      const { login } = db.findUser(id);

      return {
        name: login,
        index: id,
      };
    }),
  }));

  const updateRoomMsg: UpdateRoomMsg = {
    type: MsgType.UPDATE_ROOM,
    data: JSON.stringify(updateRoomResData),
    id: 0,
  };

  ws.send(JSON.stringify(createUserRes));
  ws.send(JSON.stringify(updateRoomMsg));

  // TODO: add types to websocket client new 'id' field
  Object.defineProperty(ws, 'id', { value: index });
});

wss.msg(MsgType.CREATE_ROOM, ({ ws, clients }) => {
  clients.forEach((client) => {
    if (client === ws) {
      const id = 'id' in client && (client.id as number);
      if (Number.isFinite(id) && id !== false) {
        rooms.createRoom(id);
      } else {
        throw new Error("Cannot find client's id!");
      }
    }
  });

  const updateRoomResData: UpdateRoomData = rooms.findRooms().map((room) => ({
    roomId: room.idGame,
    roomUsers: room.idPlayers.map((id) => {
      const { login } = db.findUser(id);

      return {
        name: login,
        index: id,
      };
    }),
  }));

  const updateRoomMsg: UpdateRoomMsg = {
    type: MsgType.UPDATE_ROOM,
    data: JSON.stringify(updateRoomResData),
    id: 0,
  };

  clients.forEach((client) => client.send(JSON.stringify(updateRoomMsg)));
});

wss.msg(MsgType.ADD_USER_ROOM, ({ data }) => {
  console.log(data);
});
