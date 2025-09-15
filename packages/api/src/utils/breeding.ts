export type ExpectedWindows = {
  hormone: { start: string; end: string };
  breeding: { start: string; end: string };
  whelping: { start: string; end: string };
  goHome: { start: string; end: string; extended_end: string };
};

export function computeExpectedFromOvulation(ovulationISO: string): ExpectedWindows {
  const ov = new Date(ovulationISO);
  const add = (d: number) => new Date(ov.getTime() + d*86400000).toISOString();
  return {
    hormone:  { start: add(-5), end: add(0) },
    breeding: { start: add(0), end: add(2) },
    whelping: { start: add(63-2), end: add(63+2) },
    goHome:   { start: add(63+56), end: add(63+58), extended_end: add(63+56+21) },
  };
}
