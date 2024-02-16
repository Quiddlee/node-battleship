import usersDB from '../data/usersDB';
import winnersDB from '../data/winnersDB';
import { RegServerData, WinnersDataRes } from '../models/user/types/types';
import { MsgType } from '../types/enums';
import { Cb } from '../types/types';

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
  const [user, index] = usersDB.createUser(name, password);

  const createdUserData: RegServerData = {
    name: user.login,
    index,
    error: false,
    errorText: '',
  };

  ws.send(MsgType.REG, createdUserData);
  Object.defineProperty(ws, 'id', { value: index });
};

/**
 * Sends the winners data to the client.
 * @param {Object} ws - The WebSocket connection of the client.
 * @param {Cb<MsgType.REG>} ws.send - A callback function that sends a message to the client.
 * @returns {void} - Returns nothing
 */
export const sendWinners: Cb<MsgType.REG> = ({ ws }) => {
  const { winners } = winnersDB;

  const winnersData: WinnersDataRes = winners.map((w) => ({
    name: w.login,
    wins: w.wins,
  }));

  ws.send(MsgType.UPDATE_WINNER, winnersData);
};
