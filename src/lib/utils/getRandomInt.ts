/**
 * Returns a random number between min and max.
 * @param {number} min - The lower bound of the range.
 * @param {number} max - The upper bound of the range.
 * @returns {number} A random number between min and max.
 */
const getRandomArbitrary = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

export default getRandomArbitrary;
