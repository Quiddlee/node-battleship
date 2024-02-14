/* eslint-disable no-console */
import 'dotenv/config';

import { WebSocketServer } from 'ws';

import db from './src/data/db';
import { httpServer } from './src/http_server';
import { MsgType } from './src/types/enums';
import { RegClientData, RegMsg, RegServerData } from './src/types/types';

const HTTP_PORT = process.env.PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });
console.log('Websocket parameters: ', wss.options);

wss.on('error', console.error);
process.on('exit', () => {
  wss.close();
});

wss.on('connection', (ws) => {
  console.log('A user connected');

  ws.on('message', (data) => {
    console.log(data.toString());
    const message: RegMsg = JSON.parse(data.toString());
    const { name, password }: RegClientData = JSON.parse(message.data);
    console.log('message from client', message);

    const [user, index] = db.createUser(name, password);
    console.log(user);

    const resData: RegServerData = {
      name: user.login,
      index,
      error: false,
      errorText: '',
    };
    const res: RegMsg = {
      type: MsgType.REG,
      data: JSON.stringify(resData),
      id: 0,
    };

    ws.send(JSON.stringify(res));
  });

  /*
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send('hello');
    }
   });
   */
});
