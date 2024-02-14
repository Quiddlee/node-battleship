import WebSocket from 'ws';

import { MsgType } from './enums';

export type Msg = {
  type: MsgType;
  data: string;
  id: 0;
};

export type RegMsg = Msg & {
  type: MsgType.REG;
};

export type RegClientData = {
  name: string;
  password: string;
};

export type RegServerData = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type MsgData = {
  [TMsg in MsgType]: TMsg extends MsgType.REG ? RegClientData : unknown;
};

export type Cb<TData extends MsgType = MsgType> = (args: {
  data: MsgData[TData];
  ws: WebSocket;
  clients: Set<WebSocket>;
}) => void;

export type TypesMap = Record<MsgType, Cb>;
