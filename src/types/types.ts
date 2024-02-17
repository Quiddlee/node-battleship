import type WebSocket from 'ws';

import type { MsgType } from './enums';
import type { Clients } from '../lib/utils/clients';
import {
  CreateGameDataRes,
  StartGameDataRes,
} from '../models/game/types/types';
import {
  AddUserRoomData,
  CreateRoomMsg,
  UpdateRoomDataRes,
} from '../models/room/types/types';
import { AddShipData } from '../models/ship/types/types';
import type {
  RegClientData,
  RegServerData,
  WinnersDataRes,
} from '../models/user/types/types';

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
      : TMsg extends MsgType.ADD_USER_ROOM
        ? AddUserRoomData
        : TMsg extends MsgType.ADD_SHIPS
          ? AddShipData
          : void;
};

export type MsgDataServer = {
  [TMsg in MsgType]: TMsg extends MsgType.REG
    ? RegServerData
    : TMsg extends MsgType.CREATE_ROOM
      ? CreateRoomMsg
      : TMsg extends MsgType.UPDATE_ROOM
        ? UpdateRoomDataRes
        : TMsg extends MsgType.UPDATE_WINNER
          ? WinnersDataRes
          : TMsg extends MsgType.CREATE_GAME
            ? CreateGameDataRes
            : TMsg extends MsgType.START_GAME
              ? StartGameDataRes
              : void;
};

export type Cb<TData extends MsgType = MsgType> = (args: {
  data: MsgDataClient[TData];
  ws: WS;
  clients: Clients;
}) => void;

export type MsgTypesMap = Record<MsgType, Cb | Cb[]>;
