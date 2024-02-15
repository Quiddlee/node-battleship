import type { WS, WsSendMsg } from '../../types/types';

export class Clients {
  private readonly clients: Set<WS>;

  private readonly chainQueue: unknown[] = [];

  constructor(clients: Set<WS>) {
    this.clients = clients;
  }

  query(ws: WS) {
    return <WS>Array.from(this.clients).find((client) => client === ws);
  }

  each() {
    this.chainQueue.push(this.clients);
    return this;
  }

  // FIXME: chaining logic
  send(msg: WsSendMsg) {
    const res = this.chainQueue.pop() as Set<WS>;
    res?.forEach((client) => client.send(msg));
    this.chainQueue.splice(0);
    return this;
  }
}
