import WebSocket, { WebSocketServer } from 'ws';

import { Clients } from './clients';
import type { MsgType } from '../../types/enums';
import type { Msg } from '../../types/interface';
import type { Cb, MsgTypesMap, WS, WsSendMsg } from '../../types/types';

export class WSS {
  private readonly msgTypesMap = <MsgTypesMap>{};

  private readonly wss: WebSocketServer;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    // console.log('Websocket parameters: ', this.wss.options);

    this.wss.on('error', console.error);
    process.on('exit', this.wss.close);
    this.wss.on('connection', this.handleWssConnect.bind(this));
  }

  public msg<T extends MsgType = MsgType>(msgType: T, cb: Cb<T>) {
    this.msgTypesMap[msgType] = <Cb>cb;
    return this;
  }

  private handleWssConnect(ws: WebSocket) {
    console.log('A user connected');
    const extendedWs = this.extendWebSocket(ws);

    extendedWs.on('message', (data) => {
      const userMsg = <Msg>JSON.parse(data.toString());
      const userData = this.extractData(userMsg);
      const msgController = this.msgTypesMap[userMsg.type];
      const clients = this.extendClients(
        this.wss.clients as unknown as Set<WS>,
      );

      msgController?.({
        data: userData,
        ws: extendedWs,
        clients,
      });
    });
  }

  private extendClients(clients: Set<WS>) {
    return new Clients(clients);
  }

  private extendWebSocket(ws: WebSocket) {
    const sendResponse = ws.send.bind(ws);
    return Object.defineProperties(ws, {
      id: {
        value: null,
        configurable: true,
        writable: true,
        enumerable: true,
      },
      send: {
        value(msg: WsSendMsg) {
          const cloneMsg = { ...msg };
          cloneMsg.data = JSON.stringify(cloneMsg.data);
          sendResponse(JSON.stringify(cloneMsg));
          return this;
        },
      },
    }) as unknown as WS;
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
