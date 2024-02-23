import type WebSocket from 'ws';

import type { MsgType } from './enums';
import type { Clients } from '../lib/utils/clients';
import type { BotAttackReq } from '../models/bot/types/types';
import type {
  AttackDataRes,
  AttackReq,
  CreateGameDataRes,
  FinishRes,
  RandomAttackReq,
  StartGameDataRes,
  TurnDataRes,
} from '../models/game/types/types';
import type {
  AddUserRoomData,
  CreateRoomMsg,
  UpdateRoomDataRes,
} from '../models/room/types/types';
import type { AddShipData } from '../models/ship/types/types';
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
    : TMsg extends MsgType.ADD_USER_ROOM
      ? AddUserRoomData
      : TMsg extends MsgType.ADD_SHIPS
        ? AddShipData
        : TMsg extends MsgType.ATTACK
          ? AttackReq
          : TMsg extends MsgType.RANDOM_ATTACK
            ? RandomAttackReq
            : TMsg extends MsgType.BOT_ATTACK
              ? BotAttackReq
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
              : TMsg extends MsgType.TURN
                ? TurnDataRes
                : TMsg extends MsgType.ATTACK
                  ? AttackDataRes
                  : TMsg extends MsgType.FINISH
                    ? FinishRes
                    : void;
};

export type CbArgs<TData extends MsgType> = {
  data: MsgDataClient[TData];
  ws: WS;
  clients: Clients;
};

export type Cb<TData extends MsgType = MsgType, TReturn = void> = (
  args: CbArgs<TData>,
) => TReturn;

export type SendWinners<TData extends MsgType = MsgType> = (
  args: {
    data: MsgDataClient[TData];
    ws: WS;
    clients: Clients;
  },
  each?: boolean,
) => void;

export type MsgTypesMap = Record<MsgType, Cb[]>;
