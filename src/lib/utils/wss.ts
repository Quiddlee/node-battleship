import { WebSocketServer } from 'ws';

import { MsgType } from '../../types/enums';
import { Msg } from '../../types/interface';
import { Cb, MsgTypesMap, WS } from '../../types/types';

export class WSS {
  private readonly msgTypesMap = <MsgTypesMap>{};

  constructor(port: number) {
    const wss = new WebSocketServer({ port });
    console.log('Websocket parameters: ', wss.options);

    wss.on('error', console.error);
    process.on('exit', () => {
      wss.close();
    });

    wss.on('connection', (ws) => {
      console.log('A user connected');

      ws.on('message', (data) => {
        const userMsg = <Msg>JSON.parse(data.toString());
        const userData = this.extractData(userMsg);

        this.msgTypesMap[userMsg.type]?.({
          data: userData,
          ws: ws as WS,
          clients: wss.clients,
        });
      });
    });
  }

  msg<T extends MsgType = MsgType>(msgType: T, cb: Cb<T>) {
    this.msgTypesMap[msgType] = <Cb>cb;
    return this;
  }

  private extractData(userMsg: Msg) {
    let userData = null;

    try {
      userData = JSON.parse(userMsg.data);
    } catch (e) {
      //
    }

    return userData;
  }
}
