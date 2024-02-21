import { Bot } from '../models/bot/bot';

class BotsDB {
  private botList: Bot[] = [];

  public createBot() {
    const bot = new Bot();
    this.botList.push(bot);
    return bot;
  }

  public findBotByIndex(id: number) {
    const bot = this.botList.find((b) => b.id === id);
    if (!bot) throw new Error('Bot with such id does not exist!');

    return bot;
  }
}

export default new BotsDB();
