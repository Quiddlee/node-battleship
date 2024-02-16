import gamesDB from '../data/gamesDB';
import { CreateGameDataRes } from '../models/game/types/types';
import { MsgType } from '../types/enums';
import { Cb } from '../types/types';

export const createGame: Cb<MsgType.ADD_USER_ROOM> = ({ clients, ws }) => {
  const { gameId, playerId } = gamesDB.createGame(ws.id);

  const responseData: CreateGameDataRes = {
    idGame: gameId,
    idPlayer: playerId,
  };

  clients.sendEach(MsgType.CREATE_GAME, responseData);
};
