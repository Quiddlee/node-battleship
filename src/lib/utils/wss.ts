import WebSocket, { WebSocketServer } from 'ws';

import { Clients } from './clients';
import type { MsgType } from '../../types/enums';
import type { Msg } from '../../types/interface';
import { Cb, MsgDataServer, MsgTypesMap, WS } from '../../types/types';

export class WSS {
  private readonly msgTypesMap = <MsgTypesMap>{};

  private readonly wss: WebSocketServer;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    // TODO: uncommnet line below when app is finished
    // console.log('Websocket parameters: ', this.wss.options);

    this.wss.on('error', console.error);
    process.on('exit', () => this.wss.close());
    this.wss.on('connection', this.handleWssConnect.bind(this));
  }

  public msg<T extends MsgType = MsgType>(msgType: T, ...cbs: Cb<T>[]) {
    this.msgTypesMap[msgType] = <Cb | Cb[]>cbs;
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

      if (Array.isArray(msgController)) {
        msgController.forEach((controller) => {
          controller?.({
            data: userData,
            ws: extendedWs,
            clients,
          });
        });
        return;
      }

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
        value<T extends MsgType>(type: T, data: MsgDataServer[T]) {
          const msg: Msg = {
            type,
            data: JSON.stringify(data),
            id: 0,
          };
          sendResponse(JSON.stringify(msg));
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
