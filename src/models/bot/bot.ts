import { SHIPS_DATA } from '../../lib/const/const';
import cell from '../../lib/utils/cell';
import getRandomArbitrary from '../../lib/utils/getRandomInt';
import { ShipDataReq, ShipPosition } from '../ship/types/types';

export class Bot {
  readonly #id;

  private readonly minDelay = 1;

  private readonly maxDelay = 1.7;

  constructor(id: number) {
    this.#id = id;
  }

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
