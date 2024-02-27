import { Bot } from '../models/bot/bot';

class BotsDB {
  private botList: Bot[] = [];

  public createBot() {
    // In order to not intersept bot id with users id, bot id will be negative number
    const bot = new Bot(-(this.botList.length + 1));
    this.botList.push(bot);
    return bot;
  }

  public findBotById(id: number) {
    const bot = this.botList.find((b) => b.id === id);
    if (!bot) throw new Error('Bot with such id does not exist!');

    return bot;
  }

  public deleteBotById(id: number) {
    const index = this.botList.findIndex((bot) => bot.id === id);
    this.botList.splice(index, 1);
  }
}

export default new BotsDB();
