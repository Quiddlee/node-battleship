/* eslint-disable no-console */
import 'dotenv/config';

import { WebSocketServer } from 'ws';

import { httpServer } from './src/http_server';

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
    console.log('message from client', JSON.parse(data.toString()));
  });

  /*
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send('hello');
    }
   });
   */
});
