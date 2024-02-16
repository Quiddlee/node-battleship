import type WebSocket from 'ws';

import type { MsgType } from './enums';
import type { Clients } from '../lib/utils/clients';
import { CreateRoomMsg, UpdateRoomDataRes } from '../models/room/types/types';
import type { RegClientData, RegServerData } from '../models/user/types/types';

export type SendFn = <T extends MsgType>(type: T, data: MsgDataServer[T]) => WS;

export type WS = Omit<WebSocket, 'send'> & {
  id: number;
  send: SendFn;
};

export type MsgDataClient = {
  [TMsg in MsgType]: TMsg extends MsgType.REG
    ? RegClientData
    : TMsg extends MsgType.CREATE_ROOM
      ? CreateRoomMsg
      : unknown;
};

export type MsgDataServer = {
  [TMsg in MsgType]: TMsg extends MsgType.REG
    ? RegServerData
    : TMsg extends MsgType.CREATE_ROOM
      ? CreateRoomMsg
      : TMsg extends MsgType.UPDATE_ROOM
        ? UpdateRoomDataRes
        : unknown;
};

export type Cb<TData extends MsgType = MsgType> = (args: {
  data: MsgDataClient[TData];
  ws: WS;
  clients: Clients;
}) => void;

export type MsgTypesMap = Record<MsgType, Cb | Cb[]>;
