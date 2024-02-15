/* eslint-disable no-console */
import 'dotenv/config';

import db from './src/data/db';
import { httpServer } from './src/http_server';
import { WSS } from './src/lib/utils/wss';
import rooms from './src/models/room/rooms';
import { UpdateRoomServerResponse } from './src/models/room/types/types';
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

  const updateRoomMsg: UpdateRoomServerResponse = {
    type: MsgType.UPDATE_ROOM,
    // TODO: Abstract find rooms with 1 player in separate method
    data: rooms.findRooms().map((room) => ({
      roomId: room.idGame,
      roomUsers: room.idPlayers.map((id) => {
        const { login } = db.findUser(id);

        return {
          name: login,
          index: id,
        };
      }),
    })),
    id: 0,
  };

  ws.send(createUserRes).send(updateRoomMsg);
  Object.defineProperty(ws, 'id', { value: index });
});

wss.msg(MsgType.CREATE_ROOM, ({ ws, clients }) => {
  // TODO: abstract finding client in separate method
  clients.forEach((client) => client === ws && rooms.createRoom(client.id));

  const updateRoomMsg: UpdateRoomServerResponse = {
    type: MsgType.UPDATE_ROOM,
    data: rooms.findRooms().map((room) => ({
      roomId: room.idGame,
      roomUsers: room.idPlayers.map((id) => {
        const { login } = db.findUser(id);

        return {
          name: login,
          index: id,
        };
      }),
    })),
    id: 0,
  };

  // TODO: abstract broadcast to all clients in separate method
  clients.forEach((client) => client.send(updateRoomMsg));
});

wss.msg(MsgType.ADD_USER_ROOM, ({ data }) => {
  console.log(data);
});
