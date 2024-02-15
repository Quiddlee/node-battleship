import { MsgType } from '../../../types/enums';
import { Msg } from '../../../types/interface';

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

export type RegServerResponse = Omit<RegMsg, 'data'> & {
  data: RegServerData;
};
