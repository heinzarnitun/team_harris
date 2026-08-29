export const USD_TO_KS = 3600;

export function formatKs(n: number) {
  return `${Math.round(n).toLocaleString("en-US")} Ks`;
}

/** Treat small numbers in AI queries as USD, larger as already-kyat. */
export function queryAmountToKs(n: number) {
  return n > 0 && n < 1000 ? Math.round(n * USD_TO_KS) : Math.round(n);
}
