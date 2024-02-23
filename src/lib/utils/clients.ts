import type { Bot } from '../../models/bot/bot';
import type { MsgType } from '../../types/enums';
import type { MsgDataServer, WS } from '../../types/types';

export class Clients {
  private readonly clients: Set<WS>;

  constructor(clients: Set<WS>) {
    this.clients = clients;
  }

  query(ws: WS) {
    return <WS>Array.from(this.clients).find((client) => client === ws);
  }

  queryById(id: number) {
    return <WS>Array.from(this.clients).find((client) => client.id === id);
  }

  sendEach<T extends MsgType>(type: T, data: MsgDataServer[T]) {
    this.clients.forEach((client) => client.send(type, data));
    return this;
  }

  add(client: WS | Bot) {
    this.clients.add(client as WS);
  }
}
