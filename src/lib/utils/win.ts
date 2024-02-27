import { Clients } from './clients';
import { sendWinners } from '../../controllers/userControllers';
import gamesDB from '../../data/gamesDB';
import winnersDB from '../../data/winnersDB';
import { FinishRes } from '../../models/game/types/types';
import { RegClientData } from '../../models/user/types/types';
import { MsgType } from '../../types/enums';
import { WS } from '../../types/types';

const win = (gameId: number, clients: Clients) => {
  const game = gamesDB.findGame(gameId);
  const [p1] = game.playerIds;

  const res: FinishRes = {
    winPlayer: p1,
  };

  game.playerIds.forEach((id) =>
    clients.queryById(id).send(MsgType.FINISH, res),
  );

  winnersDB.updateWinners(p1);

  const args = {
    data: { gameId } as unknown as RegClientData,
    clients,
    ws: {} as WS,
  };
  sendWinners(args, true);
};

export default win;
