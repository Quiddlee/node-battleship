import getRandomArbitrary from '../../lib/utils/getRandomInt';
import { ShipDataReq } from '../ship/types/types';

// TODO: change to real data
const SHIPS_DATA: ShipDataReq[] = [
  {
    position: {
      x: 7,
      y: 0,
    },
    direction: true,
    type: 'huge',
    length: 4,
  },
  {
    position: {
      x: 1,
      y: 4,
    },
    direction: false,
    type: 'large',
    length: 3,
  },
  {
    position: {
      x: 6,
      y: 7,
    },
    direction: false,
    type: 'large',
    length: 3,
  },
  {
    position: {
      x: 1,
      y: 6,
    },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 5,
      y: 3,
    },
    direction: true,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 2,
      y: 8,
    },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 9,
      y: 3,
    },
    direction: false,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 4,
      y: 0,
    },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 7,
      y: 5,
    },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 9,
      y: 5,
    },
    direction: false,
    type: 'small',
    length: 1,
  },
];

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

  public generateShips() {
    return SHIPS_DATA;
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
