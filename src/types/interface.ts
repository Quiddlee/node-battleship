import { MsgType } from './enums';

export interface Msg {
  type: MsgType;
  data: string;
  id: 0;
}
