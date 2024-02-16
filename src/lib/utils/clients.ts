import type { WS, WsSendMsg } from '../../types/types';

export class Clients {
  private readonly clients: Set<WS>;

  constructor(clients: Set<WS>) {
    this.clients = clients;
  }

  query(ws: WS) {
    return <WS>Array.from(this.clients).find((client) => client === ws);
  }

  eachSend(msg: WsSendMsg) {
    this.clients.forEach((client) => client.send(msg));
    return this;
  }
}
