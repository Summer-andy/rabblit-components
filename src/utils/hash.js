export const SEED = 5381;
export const phash = (h, x) => {
  let i = x.length;
  while (i) {
    h = (h * 33) ^ x.charCodeAt(--i);
  }
  return h;
};

export const hash = (x) => {
  return phash(SEED, x);
};
