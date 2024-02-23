import type { Bot } from '../../models/bot/bot';
import type { MsgType } from '../../types/enums';
import type { MsgDataServer, WS } from '../../types/types';

export class Clients {
  private readonly clients: WS[];

  constructor(clients: Set<WS>) {
    this.clients = Array.from(clients);
  }

  query(ws: WS) {
    return <WS>this.clients.find((client) => client === ws);
  }

  queryById(id: number) {
    return <WS>this.clients.find((client) => client.id === id);
  }

  sendEach<T extends MsgType>(type: T, data: MsgDataServer[T]) {
    this.clients.forEach((client) => client.send(type, data));
    return this;
  }

  add(client: WS | Bot) {
    this.clients.push(client as WS);
  }

  delete(id: number) {
    const index = this.clients.findIndex((cl) => cl.id === id);
    this.clients.splice(index, 1);
  }
}
