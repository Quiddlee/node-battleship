import { MsgType } from '../../../types/enums';
import { Msg } from '../../../types/interface';

export type Room = {
  idGame: number;
  idPlayers: [number] | [number, number];
};

export type CreateRoomMsg = Msg & {
  type: MsgType.CREATE_ROOM;
};

export type AddUserRoomData = {
  indexRoom: number;
};

export type AddUserRoomMsg = Msg & {
  type: MsgType.CREATE_ROOM;
};

export type CreateGameData = {
  idGame: number;
  idPlayer: number;
};

export type CreateGameMsg = Msg & {
  type: MsgType.CREATE_GAME;
};

export type UpdateRoomData = Array<{
  roomId: number;
  roomUsers: Array<{
    name: string;
    index: number;
  }>;
}>;

export type UpdateRoomMsg = Msg & {
  type: MsgType.UPDATE_ROOM;
};
