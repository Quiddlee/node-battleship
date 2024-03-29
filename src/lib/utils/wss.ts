/* eslint-disable no-console */

import { isNativeError } from 'util/types';

import WebSocket, { WebSocketServer } from 'ws';

import { Clients } from './clients';
import usersDB from '../../data/usersDB';
import { MsgType } from '../../types/enums';
import { Msg } from '../../types/interface';
import { Cb, MsgDataServer, MsgTypesMap, WS } from '../../types/types';

export class WSS {
  private readonly msgTypesMap = <MsgTypesMap>{};

  private readonly wss: WebSocketServer;

  private readonly clients: Clients;

  constructor(port: number, host: string) {
    this.wss = new WebSocketServer({ port, host });
    console.log(
      `Websocket address: ${this.wss.options.host}\nWebsocket port: ${this.wss.options.port}`,
    );

    this.wss.on('error', console.error);
    process.on('exit', () => this.wss.close());
    this.wss.on('connection', this.handleWssConnect.bind(this));

    this.clients = this.extendClients(this.wss.clients as unknown as Set<WS>);
  }

  public msg<T extends MsgType = MsgType>(msgType: T, ...cbs: Cb<T>[]) {
    this.msgTypesMap[msgType] = <Cb[]>cbs;
    return this;
  }

  private handleWssConnect(ws: WebSocket) {
    console.log('A user connected');
    const extendedWs = this.extendWebSocket(ws);

    extendedWs.on('close', () =>
      this.handleConnectionClose.call(this, extendedWs),
    );

    extendedWs.on('message', (data) => {
      const userMsg = <Msg>JSON.parse(data.toString());
      const userData = this.extractData(userMsg);
      const msgController = this.msgTypesMap[userMsg.type];

      try {
        console.log(`Command: ${userMsg.type}`);

        msgController.forEach((controller) => {
          controller?.({
            data: userData,
            ws: extendedWs,
            clients: this.clients,
          });
        });
      } catch (e) {
        if (!isNativeError(e)) return;
        console.log(e.message);
      }
    });
  }

  private handleConnectionClose(ws: WS) {
    usersDB.findUserByIndex(ws.id)?.offline();
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
