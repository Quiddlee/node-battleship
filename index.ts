/* eslint-disable no-console */
import 'dotenv/config';

import db from './src/data/db';
import { httpServer } from './src/http_server';
import { WSS } from './src/lib/utils/wss';
import { MsgType } from './src/types/enums';
import { RegMsg, RegServerData } from './src/types/types';

const HTTP_PORT = Number(process.env.HTTP_PORT);
const WSS_PORT = Number(process.env.WSS_PORT);

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WSS(WSS_PORT);

wss.msg(MsgType.REG, ({ data, ws }) => {
  console.log('message from client', data);
  const { name, password } = data;
  const [user, index] = db.createUser(name, password);

  const resData: RegServerData = {
    name: user.login,
    index,
    error: false,
    errorText: '',
  };
  const res: RegMsg = {
    type: MsgType.REG,
    data: JSON.stringify(resData),
    id: 0,
  };

  ws.send(JSON.stringify(res));
});
