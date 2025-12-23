export type ScanRecord = Record<string, any>;

const history: ScanRecord[] = [];
const MAX_HISTORY = 20;

export function addScan(record: ScanRecord) {
  history.unshift(record);
  if (history.length > MAX_HISTORY) {
    history.pop();
  }
}

export function getScanHistory() {
  return history;
}

export function clearHistory() {
  history.length = 0;
}

