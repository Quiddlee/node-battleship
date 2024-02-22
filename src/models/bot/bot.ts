import { SHIPS_DATA } from '../../lib/const/const';
import { cell, getRandomArbitrary } from '../../lib/utils';
import { ShipDataReq, ShipPosition } from '../ship';

export class Bot {
  readonly #id = -10;

  private readonly minDelay = 1;

  private readonly maxDelay = 2;

  get id() {
    return this.#id;
  }

  public send() {}

  public attack(): Promise<ShipPosition> {
    return new Promise((resolve) => {
      this.imitateHumanTiming(() => resolve(this.calcAttack()));
    });
  }

  public generateShips(): ShipDataReq[] {
    return SHIPS_DATA.at(getRandomArbitrary(0, SHIPS_DATA.length))!;
  }

  private calcAttack(): ShipPosition {
    return cell(getRandomArbitrary(0, 9), getRandomArbitrary(0, 9));
  }

  private imitateHumanTiming(cb: () => void) {
    const randomTimingSec =
      getRandomArbitrary(this.minDelay, this.maxDelay) * 1000;
    setTimeout(cb, randomTimingSec);
  }
}
