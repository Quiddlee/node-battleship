import type WebSocket from 'ws';

import type { MsgType } from './enums';
import type { Msg } from './interface';
import type { Clients } from '../lib/utils/clients';
import type { CreateRoomMsg } from '../models/room/types/types';
import type { RegClientData } from '../models/user/types/types';

export type WsSendMsg = Omit<Msg, 'data'> & { data: unknown };

export type WS = Omit<WebSocket, 'send'> & {
  id: number;
  send: (msg: WsSendMsg) => WS;
};

export type MsgData = {
  [TMsg in MsgType]: TMsg extends MsgType.REG
    ? RegClientData
    : TMsg extends MsgType.CREATE_ROOM
      ? CreateRoomMsg
      : unknown;
};

export type Cb<TData extends MsgType = MsgType> = (args: {
  data: MsgData[TData];
  ws: WS;
  clients: Clients;
}) => void;

export type MsgTypesMap = Record<MsgType, Cb>;
