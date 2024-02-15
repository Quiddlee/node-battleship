import WebSocket from 'ws';

import { MsgType } from './enums';
import { CreateRoomMsg } from '../models/room/types/types';
import { RegClientData } from '../models/user/types/types';

export type MsgData = {
  [TMsg in MsgType]: TMsg extends MsgType.REG
    ? RegClientData
    : TMsg extends MsgType.CREATE_ROOM
      ? CreateRoomMsg
      : unknown;
};

export type Cb<TData extends MsgType = MsgType> = (args: {
  data: MsgData[TData];
  ws: WebSocket;
  clients: Set<WebSocket>;
}) => void;

export type MsgTypesMap = Record<MsgType, Cb>;
