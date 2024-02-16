import { MsgType } from '../../../types/enums';
import { Msg } from '../../../types/interface';

export type CreateRoomMsg = Msg & {
  type: MsgType.CREATE_ROOM;
};

export type AddUserRoomData = {
  indexRoom: number;
};

export type UpdateRoomData = {
  roomId: number;
  roomUsers: Array<{
    name: string;
    index: number;
  }>;
};

export type UpdateRoomDataRes = Array<UpdateRoomData>;
