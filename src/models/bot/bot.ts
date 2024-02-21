import getRandomArbitrary from '../../lib/utils/getRandomInt';

export class Bot {
  #id = -10;

  private readonly minDelay = 1;

  private readonly maxDelay = 2.5;

  get id() {
    return this.#id;
  }

  public send() {}

  public attack(): Promise<{ x: number; y: number }> {
    return new Promise((resolve) => {
      this.imitateHumanTiming(() => resolve(this.calcAttack()));
    });
  }

  private calcAttack() {
    const x = getRandomArbitrary(0, 9);
    const y = getRandomArbitrary(0, 9);

    return { x, y };
  }

  private imitateHumanTiming(cb: () => void) {
    const randomTimingSec =
      getRandomArbitrary(this.minDelay, this.maxDelay) * 1000;
    setTimeout(cb, randomTimingSec);
  }
}

export default new Bot();
