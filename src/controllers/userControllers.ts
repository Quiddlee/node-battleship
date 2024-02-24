import { isNativeError } from 'util/types';

import usersDB from '../data/usersDB';
import winnersDB from '../data/winnersDB';
import logResult from '../lib/utils/logResult';
import { RegServerData, WinnersDataRes } from '../models/user/types/types';
import { MsgType } from '../types/enums';
import { Cb, SendWinners } from '../types/types';

/**
 * Registers a new user with the given name and password and sends the user data to the client.
 * @param {Object} data - The data received from the client.
 * @param {string} data.name - The name of the user.
 * @param {string} data.password - The password of the user.
 * @param {Object} ws - The WebSocket connection of the client.
 * @returns {void} - Returns nothing
 */
export const regUser: Cb<MsgType.REG> = ({ data, ws }) => {
  const { name, password } = data;

  try {
    let user;
    let index;

    if (usersDB.isUserAlreadyExist(name)) {
      [user, index] = usersDB.loginUser(name, password);
    } else {
      [user, index] = usersDB.createUser(name, password);
    }

    const res: RegServerData = {
      name: user.login,
      index,
      error: false,
      errorText: '',
    };

    ws.send(MsgType.REG, res);
    Object.defineProperty(ws, 'id', { value: index });
    logResult(res);
  } catch (e) {
    if (!isNativeError(e)) return;

    const res = {
      name,
      index: 0,
      error: true,
      errorText: e.message,
    };

    ws.send(MsgType.REG, res);
    logResult(res);
  }
};

/**
 * Sends the winners data to the client.
 * @param {Object} args - The arguments object.
 * @param {Object} args.ws - The WebSocket connection of the client.
 * @param {Clients} args.clients - The clients manager instance.
 * @param {boolean} [each] - The boolean value which indicates should the data be sent to every player or only one.
 * @returns {void} - Returns nothing
 */
export const sendWinners: SendWinners<
  MsgType.REG | MsgType.ATTACK | MsgType.RANDOM_ATTACK
> = ({ ws, clients }, each?: boolean) => {
  const { winners } = winnersDB;

  const winnersData: WinnersDataRes = winners.map((w) => ({
    name: w.login,
    wins: w.wins,
  }));

  if (each) {
    clients.sendEach(MsgType.UPDATE_WINNER, winnersData);
    return;
  }

  ws.send(MsgType.UPDATE_WINNER, winnersData);
  logResult(winnersData);
};
