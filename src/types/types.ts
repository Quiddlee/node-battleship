import WebSocket from 'ws';

import { MsgType } from './enums';
import { Msg } from './interface';
import { CreateRoomMsg } from '../models/room/types/types';
import { RegClientData } from '../models/user/types/types';

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
  clients: Set<WS>;
}) => void;

export type MsgTypesMap = Record<MsgType, Cb>;
